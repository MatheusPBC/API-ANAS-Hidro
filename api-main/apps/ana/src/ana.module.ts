import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { AnaController } from './ana.controller';
import { AnaService } from './ana.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ana, AnaSchema } from './schemas/ana.schema';
import {
  Station,
  StationSchema,
} from 'apps/stations/src/schemas/stations.schema';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.ME_CONFIG_MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MongooseModule.forFeature([{ name: Ana.name, schema: AnaSchema }]),
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
  ],
  controllers: [AnaController],
  providers: [AnaService],
})
export class AnaModule {}
