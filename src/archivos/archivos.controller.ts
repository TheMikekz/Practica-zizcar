import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ArchivosService } from './archivos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('archivos')
@UseGuards(JwtAuthGuard)
export class ArchivosController {
  constructor(private archivosService: ArchivosService) {}

  @Get()
  async findAll() {
    return await this.archivosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.archivosService.findOne(+id);
  }

  @Post()
  async create(@Body() archivoData: any) {
    return await this.archivosService.create(archivoData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() archivoData: any) {
    return await this.archivosService.update(+id, archivoData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.archivosService.delete(+id);
    return { success: true, message: 'Archivo eliminado' };
  }
}