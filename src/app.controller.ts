import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import DateUtils from './utils/DateUtils';
import DateMomentUtils from './utils/DateMomentUtils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/dates')
  getHello(): any {
    const fechaDesde = {
      fecha: '2024-10-05',
      hora: '06:00',
    };
    const fechaHasta = DateUtils.getRegistroFechaFromFecha(new Date());
    const registros = DateUtils.getRegistrosEntreFechas(fechaDesde, fechaHasta);
    return {
      registros,
    };
  }

  @Get('/datesTz')
  getTZ(): any {
    const fechaDesde = {
      fecha: '2024-10-05',
      hora: '19:00',
    };
    const fechaHasta = DateMomentUtils.getRegistroFechaFromFecha(new Date());
    const registros = DateMomentUtils.getRegistrosEntreFechas(
      fechaDesde,
      fechaHasta,
      {
        horaDesde: '09:00',
        horaHasta: '15:00',
      },
    );
    return {
      registros,
    };
  }
}
