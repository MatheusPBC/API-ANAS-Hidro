import { UploadService } from 'apps/upload/src/upload.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SesService } from '@nextnm/nestjs-ses';
import { SesEmailOptions } from '@nextnm/nestjs-ses';
import Recovery from './content/Recovery';
import Welcome from './content/Welcome';
import Active from './content/Active';
import Disabled from './content/Disabled';
import Welcome2 from './content/Welcome2';
import Changes from './content/Changes';
import Password from './content/Password';

// Corrigir para puxar do .env
const DOMAIN = process.env.FRONT_DOMAIN;
const IMG1 = process.env.IMG_KEY_1;
const IMG2 = process.env.IMG_KEY_2;
const IMG3 = process.env.IMG_KEY_3;

@Injectable()
export class MailService {
  constructor(
    private sesService: SesService,
    private jwtService: JwtService,
    private readonly uploadService: UploadService,
  ) {}
  welcome = async (user: { name: string; email: string }) => {
    const token = this.jwtService.sign(
      {
        name: user.name,
        email: user.email,
      },
      { expiresIn: '15m' },
    );

    const step1 = await this.uploadService.getFile(IMG1);

    const options: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: user.email,
      subject: 'Bem Vindo!',
      html: Welcome(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        user.name,
        `${DOMAIN}/autenticacao/redefinir_senha/${token}`,
        step1,
      ),
    };

    await this.sesService.sendEmail(options);

    const options2: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: 'emailgoodprime@goodprime.com.br',
      subject: 'Conta Criada',
      html: Welcome2(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        '' + user.name,
      ),
    };

    await this.sesService.sendEmail(options2);
  };

  recovery = async (user: { name: string; email: string }) => {
    const token = this.jwtService.sign(
      {
        name: user.name,
        email: user.email,
        icon: `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
      },
      { expiresIn: '1h' },
    );

    const options: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: user.email,
      subject: 'Recuperação de senha!',
      html: Recovery(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        user.name,
        `${DOMAIN}/autenticacao/redefinir_senha/${token}`,
      ),
    };

    await this.sesService.sendEmail(options);
  };

  active = async (user: { name: string; email: string }) => {
    const step3 = await this.uploadService.getFile(IMG3);

    const options: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: user.email,
      subject: 'Ativação de conta!',
      html: Active(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        '' + user.name,
        `${DOMAIN}/autenticacao/entrar`,
        step3,
      ),
    };

    await this.sesService.sendEmail(options);
  };

  disabled = async (user: { name: string; email: string }) => {
    const options: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: user.email,
      subject: 'Conta Desativada',
      html: Disabled(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        '' + user.name,
      ),
    };

    await this.sesService.sendEmail(options);
  };

  changes = async (user: { name: string; email: string }) => {
    const options: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: 'emailgoodprime@goodprime.com.br',
      subject: 'Conta Alterada',
      html: Changes(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        '' + user.name,
      ),
    };

    await this.sesService.sendEmail(options);
  };

  password = async (user: { name: string; email: string }) => {
    const step2 = await this.uploadService.getFile(IMG2);

    const options: SesEmailOptions = {
      from: 'noreply@goodprime.com.br',
      to: user.email,
      subject: 'Senha Criada',
      html: Password(
        `${DOMAIN}/static/media/logo.0d36ec1f79f7458166f7.png`,
        '' + user.name,
        step2,
      ),
    };

    await this.sesService.sendEmail(options);
  };
}
