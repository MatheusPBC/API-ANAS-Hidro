import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IntegratedService } from './integrated.service';
import { CreateIntegratedDto } from './dto/create.integrated.dto';
import { Integrated } from './schemas/integrated.schema';

@Controller('integrated')
export class IntegratedController {
  constructor(private readonly integratedService: IntegratedService) {}

  @Post()
  async create(@Body() createIntegratedDto: CreateIntegratedDto) {
    const integrated = await this.integratedService.create(createIntegratedDto);

    if (!integrated) throw new NotFoundException();

    return integrated;
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const integrated = await this.integratedService.findAll(page, limit);

    return integrated;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Integrated> {
    const integrated = await this.integratedService.findOne(id);

    if (!integrated) throw new NotFoundException();

    return integrated;
  }

  @Get('/:id/xml')
  async findOneXml(@Param('id') id: string): Promise<string> {
    const integrated = await this.integratedService.findOneXml(id);

    if (!integrated) throw new NotFoundException();

    return integrated;
  }

  @Delete()
  async delete(@Query('id') id?: string) {
    const calendar = await this.integratedService.delete(id);

    if (!calendar) throw new NotFoundException();

    return;
  }
}
