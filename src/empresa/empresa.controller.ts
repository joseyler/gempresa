import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Empresa } from './entities/empresa.entity';
import { EmpresaService } from './empresa.service';
import { IEmpresa } from './model/IEmpresa';

@Controller('empresas')
export class EmpresaController{
  constructor(private readonly empresaService:EmpresaService){}

  
}