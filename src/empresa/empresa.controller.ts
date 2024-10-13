import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import DateUtils from 'src/utils/DateUtils';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get('/:codigoEmpresa/details')
  async getDetalleEmpresa(
    @Param('codigoEmpresa') codigoEmpresa: string,
  ): Promise<any> {
    return await this.empresaService.getDetalleEmpresa(codigoEmpresa);
  }

  @Get('/:codigoEmpresa/cotizaciones')
  async getCotizacionesEmpresa(
    @Param('codigoEmpresa') codigoEmpresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ): Promise<any> {
    if (
      DateUtils.isValidParamDate(fechaDesde) &&
      DateUtils.isValidParamDate(fechaHasta)
    ) {
      return await this.empresaService.getDetalleEmpresa(codigoEmpresa);
    }
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Error en las fechas ' + fechaDesde + ' to ' + fechaDesde,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
