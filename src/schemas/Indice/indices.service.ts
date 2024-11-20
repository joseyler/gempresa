import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IndiceCotizacion } from 'src/model/indice.cotizacion';
import { Indice } from '../indices.schema';
import { IndiceValor } from '../indices.values.schema';

@Injectable()
export class IndicesService {
  constructor(
    @InjectModel(Indice.name) private indiceModel: Model<Indice>,
    @InjectModel(IndiceValor.name)
    private readonly indiceValorModel: Model<IndiceValor>,
  ) {}

  async create(indice: Indice): Promise<Indice> {
    const existente = await this.indiceModel
      .findOne({ code: indice.code })
      .exec();
    if (!existente) {
      const createdIndice = new this.indiceModel(indice);
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

  async createCotizacion(cotizacion: IndiceCotizacion): Promise<boolean> {
    const existente = await this.indiceValorModel
      .findOne({
        fecha: cotizacion.fecha,
        hora: cotizacion.hora,
        code: cotizacion.codigoIndice,
      })
      .exec();
    if (!existente) {
      const rec = new this.indiceValorModel({
        fecha: cotizacion.fecha,
        fechaDate: cotizacion.fecha,
        hora: cotizacion.hora,
        valor: cotizacion.valorIndice,
      });
      await rec.save();
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

  async getCotizationesbyFechas(
    codigoIndice: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<any> {
    const fechaDesdeArray = fechaDesde.split('T');
    const fechaHastaArray = fechaHasta.split('T');

    const values = await this.indiceValorModel.find({
      fechaDate: { $gte: fechaDesde, $lte: fechaHasta },
    });

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
}
