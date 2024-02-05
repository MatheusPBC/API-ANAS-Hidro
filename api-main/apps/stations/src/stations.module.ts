import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { Station, StationSchema } from './schemas/stations.schema';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.ME_CONFIG_MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
  ],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
