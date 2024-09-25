import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Indice } from '../indices.schema';

@Injectable()
export class IndicesService {
  constructor(@InjectModel(Indice.name) private indiceModel: Model<Indice>) {}

  async create(codigo:string, name:string): Promise<Indice> {
    const createdIndice = new this.indiceModel(codigo, name);
    return createdIndice.save();
  }

  async findAll(): Promise<Indice[]> {
    return this.indiceModel.find().exec();
  }
}
