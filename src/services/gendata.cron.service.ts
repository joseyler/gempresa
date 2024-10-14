/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmpresaService } from 'src/empresa/empresa.service';
import { Cotizacion } from 'src/empresa/entities/cotizacion.entity';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { RegistroCotizacion } from 'src/model/registro.cotizacion';
import DateUtils from 'src/utils/DateUtils';
import { StockGenerator } from 'src/utils/StockGenerator';

@Injectable()
export class GenDataService {
  private readonly logger = new Logger(GenDataService.name);
  constructor(private empresaService: EmpresaService) {
    this.logger.log('Servicio Gen Data Inicializado');
  }

  async generarDatosDeEmpresas() {
    const empresas = await this.empresaService.getAllEmpresas();
    empresas/*.filter((val, index) => index < 20)*/.forEach(async (emp: Empresa) => {
      this.logger.log("Running update values for " + emp.getEmpresaNombre());
      const cotizaciones: Cotizacion[] = await  this.empresaService.getLast20CotizacionEmpresa(emp.getId());
      if (cotizaciones.length === 0) {
        cotizaciones.push({
          cotization: Number(emp.cotizationInicial),
          dateUTC: '2023-12-31T23:00:00.000Z',
          fecha: '2023-12-31',
          hora: '23:00',
          empresa: emp,
          id: 0
        });
      }
      //ultima cotizacion
      const uptimaCotizacion = cotizaciones[0];
      const faltantes = DateUtils.getRegistrosEntreFechas({
        fecha: uptimaCotizacion.fecha,
        hora: uptimaCotizacion.hora
      }, 
      DateUtils.getRegistroFechaFromFecha(new Date()),
    );

    for (let indexFaltantes = 1; indexFaltantes < faltantes.length; indexFaltantes++) {
      const rc: RegistroCotizacion = faltantes[indexFaltantes];

      const stg = new StockGenerator({
        history: cotizaciones,
        estabilidad: 1 - emp.cantidadAcciones / 320000000000,
      });
      const newValueStock = stg.generateNextStockPrice();
      rc.valorAccion = newValueStock;
      const newCot = {
        cotization: newValueStock,
        fecha: rc.fecha,
        hora: rc.hora,
        empresa: emp,
        dateUTC: `${rc.fecha}T${rc.hora}`,
        id: null, 
      };
      await this.empresaService.saveCotizacion(newCot);
      cotizaciones.push(newCot);
      if (cotizaciones.length > 20) {
        cotizaciones.shift(); // Removes the first element
      }
    }

    });
  }

  @Cron('0 */10 * * * *')
  generarDatosHora() {
    this.generarDatosDeEmpresas();
  }
}
