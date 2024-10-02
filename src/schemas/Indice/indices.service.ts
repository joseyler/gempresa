import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Indice } from '../indices.schema';

@Injectable()
export class IndicesService {
  constructor(@InjectModel(Indice.name) private indiceModel: Model<Indice>) {}

  async create(indice: Indice): Promise<Indice> {
    const createdIndice = new this.indiceModel(indice);
    return createdIndice.save();
  }

  async findAll(): Promise<Indice[]> {
    return this.indiceModel.find().exec();
  }
}
