import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Archivo } from './entities/archivo.entity';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private archivosRepository: Repository<Archivo>,
  ) {}

  async findAll(): Promise<Archivo[]> {
    return await this.archivosRepository.find({
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Archivo | null> {
    return await this.archivosRepository.findOne({ where: { id } });
  }

  async create(archivoData: Partial<Archivo>): Promise<Archivo> {
    const archivo = this.archivosRepository.create(archivoData);
    return await this.archivosRepository.save(archivo);
  }

  async update(id: number, archivoData: Partial<Archivo>): Promise<Archivo | null> {
    await this.archivosRepository.update(id, archivoData);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.archivosRepository.delete(id);
  }

  async bulkUpsert(archivos: Partial<Archivo>[]): Promise<{ inserted: number; updated: number }> {
    let inserted = 0;
    let updated = 0;

    for (const archivoData of archivos) {
      const existingArchivo = await this.archivosRepository.findOne({
        where: { sourceId: archivoData.sourceId },
      });

      if (existingArchivo) {
        await this.archivosRepository.update(existingArchivo.id, archivoData);
        updated++;
      } else {
        await this.create(archivoData);
        inserted++;
      }
    }

    return { inserted, updated };
  }
}