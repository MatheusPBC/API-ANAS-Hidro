import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SesModule } from '@nextnm/nestjs-ses';
import { PrismaService } from 'common/prisma.service/prisma.service';
import { MailService } from './mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: '14400s' },
    }),
    SesModule.forRoot({
      SECRET: process.env.AWS_ACCESS_SECRET,
      AKI_KEY: process.env.AWS_ACCESS_KEY,
      REGION: process.env.AWS_REGION,
    }),
  ],
  controllers: [],
  providers: [PrismaService, MailService],
})
export class MailModule {}
