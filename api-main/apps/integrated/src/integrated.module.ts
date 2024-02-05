import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegratedController } from './integrated.controller';
import { IntegratedService } from './integrated.service';
import { Integrated, IntegratedSchema } from './schemas/integrated.schema';
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
    MongooseModule.forFeature([
      { name: Integrated.name, schema: IntegratedSchema },
    ]),
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
  ],
  controllers: [IntegratedController],
  providers: [IntegratedService],
})
export class IntegratedModule {}
