import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IndiceDocument = HydratedDocument<Indice>;

@Schema()
export class Indice {
    @Prop()
    codigo: string;

  @Prop()
  name: string;
}

export const IndiceSchema = SchemaFactory.createForClass(Indice);