import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';

@Injectable()
export class EmpresaService {
  private logger: Logger = new Logger(EmpresaService.name);

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}

  async getDetalleEmpresa(codigoEmpresa: string): Promise<any> {
    try {
      const criterio: FindOptionsWhere<Empresa> = {
        codempresa: codigoEmpresa,
      };
      const empresaResponse: Empresa =
        await this.empresaRepository.findOneBy(criterio);
      if (!empresaResponse) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Error la empresa ' + codigoEmpresa + ' : no se encuentra',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return empresaResponse;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Error la empresa ' + codigoEmpresa + ' : no se encuentra',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getAllEmpresas(): Promise<any> {
    try {
      const empresaResponse: Empresa[] = await this.empresaRepository.find();
      return empresaResponse;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }

  async getLast20CotizacionEmpresa(empresaId: number) {
    try {
      const sql = `select * from cotizaciones where idEmpresa = ${empresaId} order by dateUTC desc limit 1`;
      const response = await this.cotizacionRepository.query(sql);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
    return [];
  }

  async saveCotizacion(newCot: Cotizacion): Promise<Cotizacion> {
    return await this.cotizacionRepository.save(newCot);
  }
}
