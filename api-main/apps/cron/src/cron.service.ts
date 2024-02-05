import { Injectable } from '@nestjs/common';
import { Cron /* , CronExpression */ } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ana } from '../../ana/src/schemas/ana.schema';
import { IntegratedService } from 'apps/integrated/src/integrated.service';
import { CreateIntegratedDto } from 'apps/integrated/src/dto/create.integrated.dto';
import { Station } from 'apps/stations/src/schemas/stations.schema';
import * as crypto from 'crypto';

interface IValuesIntegrated {
  ana_ids: string[];
  datetime: number;
  planta: string;
  ponto: string;
  codigoFlu: number;
  codigoPlu?: number;
  pluviometria: number;
  fluviometria: number;
  defluencia: number;
}

@Injectable()
export class CronService {
  constructor(
    @InjectModel(Ana.name) private readonly anaModel: Model<Ana>,
    @InjectModel(Station.name) private readonly stationModel: Model<Station>,
    private readonly integratedService: IntegratedService,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // @Cron(CronExpression.EVERY_HOUR)
  @Cron('15 * * * *')
  async handleCron() {
    try {
      const group_id = crypto.randomUUID();

      const dadosJson = await this.anaModel
        .find({
          integrado: false,
        })
        .exec();

      const values: IValuesIntegrated[] = [];

      const unique = Array.from(
        new Set(dadosJson.map((obj: any) => obj.codigoFlu)),
      );

      await Promise.all(
        unique.map(async (codigoFlu: number) => {
          await this.calc(codigoFlu, dadosJson, values);
        }),
      );

      for (const dt of values) {
        const soap = await this.integratedService.soapAna(dt);

        if (soap) {
          const integrated: CreateIntegratedDto = {
            datetime: dt.datetime,
            datetime_send: soap.datetime_send,
            datetime_received: soap.datetime_received,
            planta: dt.planta,
            ponto: dt.ponto,
            codigoFlu: dt.codigoFlu,
            codigoPlu: dt.codigoPlu,
            pluviometria: dt.pluviometria,
            fluviometria: dt.fluviometria,
            defluencia: dt.defluencia ?? 0,
            xml_send: soap.xml_send,
            xml_received: soap.xml_received,
            reason_not_sent: soap.reason_not_sent ?? null,
            group_id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await this.integratedService.create(integrated);
        }

        for (const ana_id of dt.ana_ids) {
          await this.anaModel
            .updateOne({ integrado: true })
            .where({ _id: ana_id })
            .exec();
        }
      }
    } catch (error) {
      console.log('Erro ao atualizar dados da API', error);
    }
  }

  async calc(codigoFlu: number, array: any[], pushArray: IValuesIntegrated[]) {
    const ana_ids = [];

    const station = await this.stationModel.findOne({ codigoFlu }).exec();

    if (!station) return null;

    const equalFluCode = array.filter((obj) => {
      const existis = obj.codigoFlu === codigoFlu;

      ana_ids.push(obj._id);

      return existis;
    });

    const totalPluviometria = equalFluCode.reduce((acc, obj) => {
      if (obj.pluviometria) {
        const data = acc + obj.pluviometria?.valor ?? 0;

        return data;
      }
    }, 0);

    const averageDefluencia = equalFluCode.reduce((acc, obj) => {
      if (obj.defluencia) {
        const data = acc + obj.defluencia?.valor ?? 0;

        return data;
      }
    }, 0);

    const lastValObj = equalFluCode[equalFluCode.length - 1];

    const fluviometria = lastValObj?.fluviometria?.valor ?? 0;

    const defluencia = (averageDefluencia ?? 0) / equalFluCode.length;

    const payload = {
      ana_ids,
      datetime: equalFluCode[0]?.timestamp ?? Date.now(),
      login: station.login ?? '',
      senha: station.senha ?? '',
      situacao: station.situacao,
      planta: equalFluCode[0]?.planta ?? '',
      ponto: equalFluCode[0]?.ponto ?? '',
      codigoFlu,
      codigoPlu: equalFluCode[0]?.codigoPlu,
      pluviometria: totalPluviometria,
      fluviometria,
      defluencia,
    };

    pushArray.push(payload);

    return;
  }
}
