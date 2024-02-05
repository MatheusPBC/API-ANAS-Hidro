import { InjectModel } from '@nestjs/mongoose';
import { CreateIntegratedDto } from './dto/create.integrated.dto';
import { Integrated } from './schemas/integrated.schema';
import * as moment from 'moment';
import { Model } from 'mongoose';
import axios from 'axios';
import { Station } from 'apps/stations/src/schemas/stations.schema';

interface IValuesIntegrated {
  datetime: number;
  planta: string;
  ponto: string;
  codigoFlu: number;
  codigoPlu?: number;
  pluviometria: number;
  fluviometria: number;
  defluencia: number;
}

interface ISoapAnaResponse {
  codigoFlu: number;
  codigoPlu: number;
  datetime_send: number;
  datetime_received: number;
  xml_send: string;
  xml_received: string;
  reason_not_sent?: string;
}

export class IntegratedService {
  constructor(
    @InjectModel(Integrated.name)
    private readonly integratedModel: Model<Integrated>,
    @InjectModel(Station.name) private readonly stationModel: Model<Station>,
  ) {}

  async create(data: CreateIntegratedDto): Promise<Integrated> {
    const station = await this.stationModel
      .findOne({ codigoFlu: data.codigoFlu })
      .exec();

    if (!station) return null;

    const createdIntegrated = await this.integratedModel.create(data);

    return createdIntegrated;
  }

  async findAll(pg: string, lmt: string) {
    const page = pg ? Number(pg) : 1;
    const limit = lmt ? Number(lmt) : 50;

    const skipCount = (page - 1) * limit;

    const data = await this.integratedModel
      .find()
      .skip(skipCount)
      .limit(limit)
      .exec();

    const value = [];

    for (const dt of data) {
      value.push(
        dt.fluviometria ?? 0 + dt.pluviometria ?? 0 + dt.defluencia ?? 0,
      );
    }

    const sum = value.reduce((s: number, f: number) => s + f, 0);

    const integrated = {
      data,
      meta: {
        page,
        limit,
        average_per_hour: Math.round(sum / data.length),
      },
    };

    return integrated;
  }

  async findOne(id: string): Promise<Integrated> {
    const integrated = await this.integratedModel.findOne({ _id: id }).exec();

    if (!integrated) return null;

    return integrated;
  }

  async findOneXml(id: string): Promise<string> {
    const integrated = await this.integratedModel.findOne({ _id: id }).exec();

    if (!integrated) return null;

    const station = await this.stationModel
      .findOne({ codigoFlu: integrated.codigoFlu })
      .exec();

    if (!station) return null;

    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
       xmlns:q0="http://ws.integracao.ana.gov.br/"
       xmlns:xsd="http://www.w3.org/2001/XMLSchema"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
       <soapenv:Header/>
       <soapenv:Body>
         <q0:consultarMedicao>
         <login>${process.env.XML_ANA_USERNAME}</login>
         <senha>${process.env.XML_ANA_PASSWORD}</senha>
         ${
           integrated.codigoPlu
             ? `<codigoPLU>${integrated.codigoPlu}</codigoPLU>`
             : ''
         }
         <codigoFLU>${integrated.codigoFlu}</codigoFLU>
         <dataInicial>${integrated.datetime}</dataInicial>
         <dataFinal>${integrated.datetime}</dataFinal>
         </q0:consultarMedicao>
       </soapenv:Body>
     </soapenv:Envelope>
    `;

    let url: string;

    if (station.situacao === 'producao') {
      url = process.env.XML_ANA_PROD_URL;
    } else {
      url = process.env.XML_ANA_HOMOLOG_URL;
    }

    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
      },
    };

    // Faz a solicitação POST SOAP
    const response = await axios.post(url, xml, config);

    return response.data;
  }

  async delete(_id?: string) {
    if (_id === 'all') {
      await this.integratedModel.deleteMany({}).exec();
    } else {
      const integrated = await this.integratedModel.findOne({ _id }).exec();

      if (!integrated) return null;

      await this.integratedModel.deleteOne({ _id: integrated._id }).exec();
    }

    return true;
  }

  async soapAna(data: IValuesIntegrated): Promise<ISoapAnaResponse | null> {
    const station = await this.stationModel
      .findOne({ codigoFlu: data.codigoFlu })
      .exec();

    if (!station) return null;

    const datetime_send = new Date().getTime();
    const login = station.login;
    const senha = station.senha;
    const codigoFlu = data.codigoFlu;
    const codigoPlu = data.codigoPlu;
    const vazao = data.defluencia;
    const dataMedicao = moment(data.datetime)
      .subtract(2, 'hours')
      .format('DD/MM/YYYY HH:00:00');
    const nivel = data.fluviometria;
    const chuva = data.pluviometria;

    const integrated: Integrated = await this.integratedModel
      .findOne({ codigoFlu })
      .sort({ createdAt: -1 })
      .limit(1);

    if (station.situacao !== 'sem_envio') {
      if (
        vazao >= 0 &&
        vazao <= this.oneHundredFiftyPercentage(integrated?.defluencia ?? 0)
      ) {
        const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:q0="http://ws.integracao.ana.gov.br/" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Header />
          <soapenv:Body>
            <q0:inserirMedicao>
              <login>${login}</login>
              <senha>${senha}</senha>
              <estacao>
                <codigoFlu>${codigoFlu}</codigoFlu>
                ${codigoPlu ? `<codigoPlu>${codigoPlu}</codigoPlu>` : ''}
                <medicao>
                ${typeof chuva === 'number' ? `<chuva>${chuva}</chuva>` : ''}
                  <dataMedicao>${dataMedicao}</dataMedicao>
                  <nivel>${nivel}</nivel>
                  ${vazao ? `<vazao>${vazao}</vazao>` : ''}
                </medicao>
              </estacao>
            </q0:inserirMedicao>
          </soapenv:Body>
        </soapenv:Envelope>`;

        let url: string;

        if (station.situacao === 'producao') {
          url = process.env.XML_ANA_PROD_URL;
        } else {
          url = process.env.XML_ANA_HOMOLOG_URL;
        }

        const config = {
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
          },
        };

        let response: string;

        try {
          // Faz a solicitação POST SOAP
          const res = await axios.post(url, xml, config);

          response = res.data;
        } catch (error) {
          response = error.response.data;
        }

        const datetime_received = new Date().getTime();

        const payload: ISoapAnaResponse = {
          codigoFlu,
          codigoPlu,
          datetime_send,
          datetime_received,
          xml_send: xml,
          xml_received: response,
        };

        return payload;
      } else {
        const payload: ISoapAnaResponse = {
          codigoFlu,
          codigoPlu,
          datetime_send,
          datetime_received: null,
          xml_send: null,
          xml_received: null,
          reason_not_sent:
            vazao < 0
              ? 'Vazão com valor negativo'
              : vazao >
                this.oneHundredFiftyPercentage(integrated?.defluencia ?? 0)
              ? 'Vazão à 150% maior que o último registro'
              : null,
        };

        return payload;
      }
    } else {
      const payload: ISoapAnaResponse = {
        codigoFlu,
        codigoPlu,
        datetime_send,
        datetime_received: null,
        xml_send: null,
        xml_received: null,
        reason_not_sent:
          vazao < 0
            ? 'Vazão com valor negativo'
            : vazao >
              this.oneHundredFiftyPercentage(integrated?.defluencia ?? 0)
            ? 'Vazão à 150% maior que o último registro'
            : null,
      };

      return payload;
    }
  }

  oneHundredFiftyPercentage(defluencia: number) {
    const value = (defluencia * 150) / 100;

    return value;
  }
}
