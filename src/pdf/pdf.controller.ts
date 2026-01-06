import { Controller, Post, UseGuards } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ArchivosService } from '../archivos/archivos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pdf')
@UseGuards(JwtAuthGuard)
export class PdfController {
  constructor(
    private pdfService: PdfService,
    private archivosService: ArchivosService,
  ) {}

  @Post('ingest')
  async ingestPdf() {
    try {
      // Extración
      const rawArchivos = await this.pdfService.extractDataFromPdf();
      
      // Normalización
      const normalizedArchivos = this.pdfService.normalizeArchivos(rawArchivos);
      
      // Carga de BD
      const results = await this.archivosService.bulkUpsert(normalizedArchivos);
      
      return {
        success: true,
        message: 'PDF procesado correctamente',
        extracted: rawArchivos.length,
        inserted: results.inserted,
        updated: results.updated,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al procesar el PDF',
        error: error.message,
      };
    }
  }
}