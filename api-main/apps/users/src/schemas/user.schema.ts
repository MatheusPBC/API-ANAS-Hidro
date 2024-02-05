import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  access_key?: string;

  @Prop()
  secret_access_token_id?: string;

  @Prop()
  project: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
