import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { IEmpresa } from './model/IEmpresa';
import { Empresa } from './entities/empresa.entity';

@Injectable()
export class EmpresaService{
  private empresas: Empresa[]=[]

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository:Repository<Empresa>
  ){}
  
}