import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IndicesService } from './indices.service';
import { Indice } from '../indices.schema';
import { IndiceCotizacion } from 'src/model/indice.cotizacion';
import DateUtils from 'src/utils/DateUtils';

@Controller('/indices')
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) {}

  @Get()
  async getIndices(): Promise<Indice[]> {
    return await this.indicesService.findAll();
  }

  @Get('/:codigoIndice/cotizaciones/')
  async getCotizaciones(
    @Param('codigoIndice') codigoIndice: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ): Promise<any> {
    if (
      DateUtils.isValidParamDate(fechaDesde) &&
      DateUtils.isValidParamDate(fechaHasta)
    ) {
      return await this.indicesService.getCotizationesbyFechas(
        codigoIndice,
        fechaDesde,
        fechaHasta,
      );
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Error en las fechas ' + fechaDesde + ' to ' + fechaHasta,
      },
      HttpStatus.NOT_FOUND,
    );
  }

  @Post('/cotizaciones')
  async postCotizaciones(@Body() body: IndiceCotizacion): Promise<any> {
    const result = await this.indicesService.createCotizacion(body);
    return {
      result,
    };
  }

  @Post()
  async createIndice(
    @Body() body: { code: string; name: string },
  ): Promise<Indice> {
    return await this.indicesService.create(body);
  }
}
