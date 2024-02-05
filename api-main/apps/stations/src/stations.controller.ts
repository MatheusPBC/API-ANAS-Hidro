import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create.station.dto';
import { Station } from './schemas/stations.schema';
import { UpdateStationDto } from './dto/update.station.dto';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  async create(@Body() createStationDto: CreateStationDto) {
    const [station, error] = await this.stationsService.create(
      createStationDto,
    );

    if (error) throw new HttpException(error, 422);

    return station;
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('name') name?: string,
  ) {
    const stations = await this.stationsService.findAll(page, limit, name);

    return stations;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Station> {
    const station = await this.stationsService.findOne(id);

    if (!station) throw new NotFoundException();

    return station;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    const [station, error] = await this.stationsService.update(
      id,
      updateStationDto,
    );

    if (error) throw new HttpException(error, 422);

    if (!station) throw new NotFoundException();

    return station;
  }

  @Delete()
  async delete(@Query('id') id?: string) {
    const station = await this.stationsService.delete(id);

    if (!station) throw new NotFoundException();

    return;
  }
}
