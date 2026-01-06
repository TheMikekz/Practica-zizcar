import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { ArchivosModule } from '../archivos/archivos.module';

@Module({
  imports: [ArchivosModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}