import { Body, Controller, Get, Post } from '@nestjs/common';
import { IndicesService } from './indices.service';
import { Indice } from '../indices.schema';

@Controller()
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) {}

  @Get()
  async getIndices(): Promise<Indice[]> {
    return await this.indicesService.findAll();
  }

  @Post()
  async createIndice(@Body() body: { codigo: string; name: string }): Promise<Indice> {
    return await this.indicesService.create(body.codigo,body.name);
  }
}
