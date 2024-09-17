/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StockGenerator } from 'src/utils/StockGenerator';

@Injectable()
export class GenDataService {
  private readonly logger = new Logger(GenDataService.name);
  constructor() {
    this.logger.log('Servicio Gen Data Inicializado');
  }

  async generarDatosDeEmpresas() {
    const empresas = [];
    empresas.forEach((emp) => {
      const stg = new StockGenerator(
        emp.stockValue,
        emp.stabilityFactor,
        emp.history,
      );
      const newValueStock = stg.generateNextStockPrice();
    }); //update valor en empresa;
  }

  @Cron('0 * * * * *')
  generarDatosHora() {
    this.generarDatosDeEmpresas();
  }
}
