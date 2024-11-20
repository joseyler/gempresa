import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Indice, IndiceSchema } from '../indices.schema';
import { IndicesService } from './indices.service';
import { IndicesController } from './indices.controller';
import { IndiceValor, IndiceValorSchema } from '../indices.values.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Indice.name, schema: IndiceSchema },
      { name: IndiceValor.name, schema: IndiceValorSchema },
    ]),
  ],
  controllers: [IndicesController],
  providers: [IndicesService],
})
export class IndicesModule {}
