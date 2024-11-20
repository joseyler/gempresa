export interface IndiceValorInterface {
  valor: number;
  fecha: string;
  hora: string;
  fechaDate: string;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IndiceValorDocument = HydratedDocument<IndiceValor>;

@Schema()
export class IndiceValor {
  @Prop()
  code: string;

  @Prop()
  fecha: string;

  @Prop()
  hora: string;

  @Prop()
  fechaDate: Date;

  @Prop()
  valor: number;
}

export const IndiceValorSchema = SchemaFactory.createForClass(IndiceValor);
