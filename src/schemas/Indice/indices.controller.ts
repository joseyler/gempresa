import { Body, Controller, Get, Post } from '@nestjs/common';
import { IndicesService } from './indices.service';
import { Indice } from '../indices.schema';

@Controller('/indices')
export class IndicesController {
  constructor(private readonly indicesService: IndicesService) {}

  @Get()
  async getIndices(): Promise<Indice[]> {
    return await this.indicesService.findAll();
  }

  @Post()
  async createIndice(
    @Body() body: { code: string; name: string },
  ): Promise<Indice> {
    return await this.indicesService.create(body);
  }
}
