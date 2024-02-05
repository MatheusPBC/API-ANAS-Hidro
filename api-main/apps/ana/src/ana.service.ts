import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ana } from './schemas/ana.schema';
import { UpdateAnaDto } from './dto/update.ana.dto';
import { CreateAnaDto } from './dto/create.ana.dto';
import * as moment from 'moment';
import { Station } from 'apps/stations/src/schemas/stations.schema';

@Injectable()
export class AnaService {
  constructor(
    @InjectModel(Ana.name) private readonly anaModel: Model<Ana>,
    @InjectModel(Station.name) private readonly stationModel: Model<Station>,
  ) {}

  async create(createAnaDto: CreateAnaDto): Promise<Ana> {
    const station = await this.stationModel
      .findOne({ codigoFlu: createAnaDto.codigoFlu })
      .exec();

    if (!station) return null;

    const createdAna = await this.anaModel.create(createAnaDto);

    return createdAna;
  }

  async findAll(
    start_date?: string,
    end_date?: string,
    pg?: string,
    lmt?: string,
  ): Promise<Ana[]> {
    start_date = start_date ?? moment().startOf('month').format('YYYY-MM-DD');
    end_date = end_date ?? moment().endOf('month').format('YYYY-MM-DD');
    const page = Number(pg ?? 1);
    const limit = Number(lmt ?? 100);
    const skipCount = (page - 1) * limit;

    const anas: Ana[] = await this.anaModel
      .find({
        timestamp: {
          $gte: new Date(start_date).getTime(),
          $lt: new Date(end_date).getTime(),
        },
      })
      .skip(skipCount)
      .limit(limit)
      .exec();

    return anas;
  }

  async findOne(id: string): Promise<Ana> {
    const ana = await this.anaModel.findOne({ _id: id }).exec();

    if (!ana) return null;

    return ana;
  }

  async update(id: string, data: UpdateAnaDto) {
    const ana = await this.anaModel.findOne({ _id: id }).exec();

    if (!ana) return null;

    ana.integrado = data.integrado ?? ana.integrado;
    ana.planta = data.planta ?? ana.planta;
    ana.ponto = data.ponto ?? ana.ponto;
    ana.codigoFlu = data.codigoFlu ?? ana.codigoFlu;
    ana.codigoPlu = data.codigoPlu ?? ana.codigoPlu;
    ana.pluviometria = data.pluviometria ?? ana.pluviometria;
    ana.fluviometria = data.fluviometria ?? ana.fluviometria;
    // ana.defluencia = data.defluencia ?? ana.defluencia;

    ana.save();

    return ana;
  }

  async delete(_id: string) {
    if (_id === 'all') {
      await this.anaModel.deleteMany({}).exec();
    } else {
      const event = await this.anaModel.findOne({ _id }).exec();

      if (!event) return null;

      await this.anaModel.deleteOne({ _id: event._id }).exec();
    }

    return true;
  }
}
