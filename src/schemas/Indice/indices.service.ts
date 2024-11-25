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
        code: cotizacion.codigoIndice,
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
      fechaDate: {
        $gte: `${fechaDesdeArray[0]}T00:00:00.000Z`,
        $lte: `${fechaHastaArray[0]}T00:00:00.000Z`,
      },
      code: codigoIndice,
    });

    const filtradosHora = values.filter((cot) => {
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
    filtradosHora.sort((cot1, cot2) => {
      if (cot1.fecha == cot2.fecha) {
        return cot1.hora < cot2.hora ? -1 : 1;
      } else {
        return cot1.fecha < cot2.fecha ? -1 : 1;
      }
    });
    return filtradosHora;
  }

  async eliminarCotizationesbyFechas(
    codigoIndice: string,
    fechaDesde: string,
    fechaHasta: string,
  ): Promise<any> {
    const aborrar = await this.getCotizationesbyFechas(
      codigoIndice,
      fechaDesde,
      fechaHasta,
    );

    const promesas = aborrar.map(async (cot): Promise<number> => {
      const respuesta = await this.indiceValorModel.deleteOne({ _id: cot._id });
      return respuesta.deletedCount;
    });
    const resultados = await Promise.all(promesas);
    const conErrores = resultados.filter(
      (cantidadBorrados) => cantidadBorrados != 1,
    );
    if (conErrores.length > 0) {
      throw new Error('Error eliminando registro');
    }
    return {
      eliminados: resultados.length,
    };
    // alternativa 2 (old school)
    // for (let index = 0; index < aborrar.length; index++) {
    //   const cot = aborrar[index];
    //   const respuesta = await this.indiceValorModel.deleteOne({ _id: cot._id });
    //   if (respuesta.deletedCount != 1) {
    //     throw new Error('Error eliminando registro');
    //   }
    // }
  }
}
