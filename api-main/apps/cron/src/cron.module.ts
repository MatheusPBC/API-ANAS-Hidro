import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ana, AnaSchema } from 'apps/ana/src/schemas/ana.schema';
import { ScheduleModule } from '@nestjs/schedule';
import {
  Integrated,
  IntegratedSchema,
} from 'apps/integrated/src/schemas/integrated.schema';
import { IntegratedService } from 'apps/integrated/src/integrated.service';
import {
  Station,
  StationSchema,
} from 'apps/stations/src/schemas/stations.schema';
config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.ME_CONFIG_MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MongooseModule.forFeature([{ name: Ana.name, schema: AnaSchema }]),
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
    MongooseModule.forFeature([
      { name: Integrated.name, schema: IntegratedSchema },
    ]),
  ],
  controllers: [],
  providers: [CronService, IntegratedService],
})
export class CronModule {}
