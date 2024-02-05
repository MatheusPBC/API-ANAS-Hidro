import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStationDto } from './dto/create.station.dto';
import { Station } from './schemas/stations.schema';
import { UpdateStationDto } from './dto/update.station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectModel(Station.name) private readonly stationModel: Model<Station>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<[Station, string]> {
    const findByCodigoFlu = await this.stationModel
      .findOne({ codigoFlu: createStationDto.codigoFlu })
      .exec();

    if (findByCodigoFlu) return [null, 'ALREADY_EXISTIS'];

    const val = Object.values(['homologacao', 'producao', 'sem_envio']);

    if (!val.includes(createStationDto.situacao)) {
      return [null, 'INVALID_SITUACAO'];
    }

    const createdStation = await this.stationModel.create(createStationDto);

    return [createdStation, null];
  }

  async findAll(pg: string, lmt: string, name?: string): Promise<Station[]> {
    const page = pg ? Number(pg) : 1;
    const limit = lmt ? Number(lmt) : 10;

    const skipCount = (page - 1) * limit;

    let stations: Station[] = [];

    if (name) {
      stations = await this.stationModel
        .find({ nome: { $regex: name, $options: 'i' } })
        .skip(skipCount)
        .limit(limit)
        .exec();
    } else {
      stations = await this.stationModel
        .find()
        .skip(skipCount)
        .limit(limit)
        .exec();
    }

    return stations;
  }

  async findOne(_id: string): Promise<Station> {
    const station = await this.stationModel.findOne({ _id }).exec();

    if (!station) return null;

    return station;
  }

  async update(
    _id: string,
    data: UpdateStationDto,
  ): Promise<[Station, string]> {
    const station = await this.stationModel.findOne({ _id }).exec();

    if (!station) return [null, null];

    if (data.codigoFlu) {
      const findByCodigoFlu = await this.stationModel
        .findOne({ codigoFlu: data.codigoFlu })
        .exec();

      if (findByCodigoFlu && findByCodigoFlu._id.toString() !== _id) {
        return [null, 'ALREADY_EXISTIS'];
      }
    }

    if (data.situacao) {
      const val = Object.values(['homologacao', 'producao', 'sem_envio']);

      if (!val.includes(data.situacao)) {
        return [null, 'INVALID_SITUACAO'];
      }
    }

    station.usina = data.usina ?? station.usina;
    station.nome = data.nome ?? station.nome;
    station.login = data.login ?? station.login;
    station.senha = data.senha ?? station.senha;
    station.situacao = data.situacao ?? station.situacao;
    station.codigoFlu = data.codigoFlu ?? station.codigoFlu;
    station.codigoPlu = data.codigoPlu ?? station.codigoPlu;

    station.save();

    return [station, null];
  }

  async delete(_id?: string) {
    if (_id === 'all') {
      await this.stationModel.deleteMany({}).exec();
    } else {
      const station = await this.stationModel.findOne({ _id }).exec();

      if (!station) return null;

      await this.stationModel.deleteOne({ _id: station._id }).exec();
    }

    return true;
  }
}
