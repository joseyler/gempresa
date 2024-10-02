import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Indice, IndiceSchema } from '../indices.schema';
import { IndicesService } from './indices.service';
import { IndicesController } from './indices.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Indice.name, schema: IndiceSchema }]),
  ],
  controllers: [IndicesController],
  providers: [IndicesService],
})
export class IndicesModule {}
