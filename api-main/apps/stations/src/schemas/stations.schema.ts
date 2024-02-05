import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StationDocument = HydratedDocument<Station>;

@Schema({ timestamps: true })
export class Station {
  @Prop()
  usina: string;

  @Prop()
  nome: string;

  @Prop()
  login: string;

  @Prop()
  senha: string;

  /**
   * @argument homologacao (homologação)
   * @argument producao (produção)
   * @argument sem_envio (sem envio)
   */
  @Prop({ options: ['homologacao', 'producao', 'sem_envio'] })
  situacao: 'homologacao' | 'producao' | 'sem_envio';

  @Prop()
  codigoFlu: number;

  @Prop()
  codigoPlu?: number | null;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StationSchema = SchemaFactory.createForClass(Station);
