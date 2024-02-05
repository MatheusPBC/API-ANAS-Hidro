import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AnaService } from './ana.service';
import { CreateAnaDto } from './dto/create.ana.dto';
import { Ana } from './schemas/ana.schema';
import { UpdateAnaDto } from './dto/update.ana.dto';

@Controller('ana')
export class AnaController {
  constructor(private readonly anaService: AnaService) {}

  @Post()
  async create(@Body() createAnaDto: CreateAnaDto) {
    const ana = await this.anaService.create(createAnaDto);

    if (!ana) throw new NotFoundException();

    return ana;
  }

  @Get()
  async findAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Ana[]> {
    const anas = await this.anaService.findAll(
      start_date,
      end_date,
      page,
      limit,
    );

    return anas;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ana> {
    const ana = await this.anaService.findOne(id);

    if (!ana) throw new NotFoundException();

    return ana;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnaDto: UpdateAnaDto,
  ): Promise<Ana> {
    const ana = await this.anaService.update(id, updateAnaDto);

    if (!ana) throw new NotFoundException();

    return ana;
  }

  @Delete()
  async delete(@Query('id') id: string) {
    const ana = await this.anaService.delete(id);

    if (!ana) throw new NotFoundException();

    return;
  }
}
