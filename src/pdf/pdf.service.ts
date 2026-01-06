import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface ArchivoData {
  sourceId: string;
  date: string;
  category: string;
  amount: number;
  status: string;
  description: string;
}

@Injectable()
export class PdfService {
  async extractDataFromPdf(): Promise<ArchivoData[]> {
    const pdfPath = path.join(__dirname, '../../..', 'data', 'data.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file not found at: ' + pdfPath);
    }
    
    console.log('✅ PDF encontrado!');

    const dataBuffer = fs.readFileSync(pdfPath);
  
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(dataBuffer);
    return this.parseExtractedText(pdfData.text);
  }

  private parseExtractedText(text: string): ArchivoData[] {
    const archivos: ArchivoData[] = [];
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(INV-\d{4}-\d{3})\s*(\d{2}-\d{2}-\d{4})\s*([A-Za-zÃ­Ã³Ã¡Ã©Ãº]+)\s*\$?(\d{1,5}\.?\d{0,3})\s*(activo|pendiente|completado|cancelado)\s*(.+)$/i);
      
      if (match) {
        try {
          const sourceId = match[1];
          const dateStr = match[2];
          const category = match[3];
          const amountStr = match[4];
          const status = match[5];
          const description = match[6];
          
          // Convertidor de fecha a YYYY-MM-DD
          const [day, month, year] = dateStr.split('-');
          const date = `${year}-${month}-${day}`;

          const amount = parseFloat(amountStr.replace(/\./g, ''));
          
          archivos.push({
            sourceId: sourceId.trim(),
            date,
            category: category.trim(),
            amount,
            status: status.trim().toLowerCase(),
            description: description.trim(),
          });
        } catch (e) {
        }
      }
    }
    
    if (archivos.length > 0) {
    }
    return archivos;
  }

  normalizeArchivos(rawArchivos: ArchivoData[]): any[] {
    return rawArchivos.map(archivo => ({
      sourceId: archivo.sourceId,
      date: new Date(archivo.date),
      category: this.normalizeCategory(archivo.category),
      amount: archivo.amount,
      status: this.normalizeStatus(archivo.status),
      description: archivo.description || '',
    }));
  }

  private normalizeCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'ventas': 'Ventas',
      'gastos': 'Gastos',
      'inventario': 'Inventario',
      'servicios': 'Servicios',
    };
    
    return categoryMap[category.toLowerCase()] || category;
  }

  private normalizeStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'activo': 'activo',
      'pendiente': 'pendiente',
      'completado': 'completado',
      'cancelado': 'cancelado',
    };
    
    return statusMap[status.toLowerCase()] || status.toLowerCase();
  }
}