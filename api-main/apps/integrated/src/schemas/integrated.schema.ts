import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IntegratedDocument = HydratedDocument<Integrated>;

@Schema()
export class Integrated {
  @Prop()
  datetime: Date;

  @Prop()
  datetime_send: Date;

  @Prop()
  datetime_received?: Date;

  @Prop()
  planta: string;

  @Prop()
  ponto: string;

  @Prop()
  codigoFlu: number;

  @Prop()
  codigoPlu?: number;

  @Prop()
  pluviometria: number;

  @Prop()
  fluviometria: number;

  @Prop()
  defluencia: number;

  @Prop()
  xml_send?: string;

  @Prop()
  xml_received?: string;

  @Prop()
  reason_not_sent?: string;

  @Prop()
  group_id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const IntegratedSchema = SchemaFactory.createForClass(Integrated);
