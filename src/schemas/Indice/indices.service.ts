import { Model, Connection, Schema } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { IndiceCotizacion } from 'src/model/indice.cotizacion';
import { Indice } from '../indices.schema';
import IndiceValor, { IndiceValorInterface } from '../indices.values.schema';

@Injectable()
export class IndicesService {
  constructor(
    @InjectModel(Indice.name) private indiceModel: Model<Indice>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(indice: Indice): Promise<Indice> {
    const existente = await this.indiceModel
      .findOne({ code: indice.code })
      .exec();
    if (!existente) {
      const createdIndice = new this.indiceModel(indice);
      await this.getOrCreateSchema(`indice${indice.code}`);
      return createdIndice.save();
    }
    console.log(existente);
    throw new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: 'Already Created',
      },
      HttpStatus.CONFLICT,
    );
  }

  async findAll(): Promise<Indice[]> {
    return this.indiceModel.find().exec();
  }

  async getOrCreateSchema(schemaName: string): Promise<Model<any>> {
    if (this.connection.models[schemaName]) {
      return this.connection.models[schemaName];
    }
    const schemaNew = new Schema(IndiceValor);
    const model = this.connection.model(schemaName, schemaNew);
    return model;
  }

  async createCotizacion(cotizacion: IndiceCotizacion): Promise<boolean> {
    const schemaName = `indice${cotizacion.codigoIndice.toLowerCase()}es`;
    const collections = await this.connection.listCollections();
    const collect = collections.find((co) => co.name === schemaName);
    if (collect) {
      const model = await this.getOrCreateSchema(schemaName);
      const existente = await model
        .findOne({ fecha: cotizacion.fecha, hora: cotizacion.hora })
        .exec();
      if (!existente) {
        const rec: IndiceValorInterface = {
          fecha: cotizacion.fecha,
          fechaDate: cotizacion.fecha,
          hora: cotizacion.hora,
          valor: cotizacion.valorIndice,
        };
        await model.create(rec);
        return true;
      }
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'ya existe valor indice',
        },
        HttpStatus.CONFLICT,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'No Existe indice',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async getCotizationesbyFechas(
    codigoIndice: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<any> {
    const fechaDesdeArray = fechaDesde.split('T');
    const fechaHastaArray = fechaHasta.split('T');
    const schemaName = `indice${codigoIndice.toLowerCase()}es`;
    const collections = await this.connection.listCollections();
    const collect = collections.find((co) => co.name === schemaName);
    if (collect) {
      const model = await this.getOrCreateSchema(schemaName);
      const values = await model
        .find({
          fechaDate: { $gte: fechaDesde, $lte: fechaHasta },
        })
        .exec();
      return values.filter((cot) => {
        let validoDesde = true;
        let validoHasta = true;
        if (cot.fecha == fechaDesdeArray[0]) {
          if (cot.hora < fechaDesdeArray[1]) {
            validoDesde = false;
          }
        }
        if (cot.fecha == fechaHastaArray[0]) {
          if (cot.hora > fechaHastaArray[1]) {
            validoHasta = false;
          }
        }
        return validoDesde && validoHasta;
      });
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'No Existe indice',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
