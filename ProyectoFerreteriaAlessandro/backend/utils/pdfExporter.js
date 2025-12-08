const PDFDocument = require('pdfkit');

/**
 * Genera un archivo PDF a partir de datos tabulares
 * @param {Object} options - Opciones de exportación
 * @param {string} options.title - Título del reporte
 * @param {Array<Object>} options.columns - Definición de columnas [{header: 'Nombre', key: 'nombre', width: 100}]
 * @param {Array<Object>} options.data - Datos a exportar (arreglo de objetos)
 * @param {string} options.orientation - Orientación: 'portrait' o 'landscape' (opcional, default: portrait)
 * @returns {Promise<Buffer>} - Buffer del archivo PDF
 */
const generatePDF = ({ title = 'Reporte', columns, data, orientation = 'portrait' }) => {
  return new Promise((resolve, reject) => {
    try {
      // Configuración del documento
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: orientation,
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];

      // Capturar el stream en chunks
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Título del documento
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text(title, { align: 'center' })
         .moveDown();

      // Información adicional
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, { align: 'right' })
         .moveDown();

      // Si no hay datos
      if (!data || data.length === 0) {
        doc.fontSize(12)
           .text('No hay datos para mostrar', { align: 'center' });
        doc.end();
        return;
      }

      // Calcular anchos de columna
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const totalCustomWidth = columns.reduce((sum, col) => sum + (col.width || 0), 0);

      let columnWidths;
      if (totalCustomWidth > 0) {
        // Usar anchos personalizados proporcionalmente
        const scale = pageWidth / totalCustomWidth;
        columnWidths = columns.map(col => (col.width || 100) * scale);
      } else {
        // Distribuir equitativamente
        const colWidth = pageWidth / columns.length;
        columnWidths = columns.map(() => colWidth);
      }

      // Función para dibujar una fila
      const drawRow = (y, rowData, isHeader = false) => {
        let x = doc.page.margins.left;

        if (isHeader) {
          doc.font('Helvetica-Bold').fontSize(10);
          // Fondo gris para encabezado
          doc.rect(doc.page.margins.left, y, pageWidth, 20)
             .fillAndStroke('#4472C4', '#000000');
          doc.fillColor('#FFFFFF');
        } else {
          doc.font('Helvetica').fontSize(9);
          doc.fillColor('#000000');
        }

        columns.forEach((col, idx) => {
          const cellWidth = columnWidths[idx];
          const text = String(rowData[col.key] || '');

          // Limitar texto si es muy largo
          const maxWidth = cellWidth - 10;
          doc.text(text, x + 5, y + 5, {
            width: maxWidth,
            ellipsis: true,
            lineBreak: false
          });

          // Dibujar borde de celda
          if (!isHeader) {
            doc.rect(x, y, cellWidth, 20).stroke();
          }

          x += cellWidth;
        });

        return y + 20;
      };

      // Dibujar encabezado de tabla
      let currentY = doc.y;
      const headerData = {};
      columns.forEach(col => {
        headerData[col.key] = col.header;
      });
      currentY = drawRow(currentY, headerData, true);

      // Dibujar filas de datos
      data.forEach((row, index) => {
        // Verificar si necesitamos una nueva página
        if (currentY > doc.page.height - doc.page.margins.bottom - 30) {
          doc.addPage();
          currentY = doc.page.margins.top;
          // Redibujar encabezado en nueva página
          currentY = drawRow(currentY, headerData, true);
        }

        currentY = drawRow(currentY, row, false);
      });

      // Finalizar documento
      doc.end();
    } catch (error) {
      reject(new Error(`Error al generar PDF: ${error.message}`));
    }
  });
};

/**
 * Genera un PDF simple con texto
 * @param {Object} options - Opciones
 * @param {string} options.title - Título
 * @param {string} options.content - Contenido del PDF
 * @returns {Promise<Buffer>}
 */
const generateSimplePDF = ({ title, content }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text(title, { align: 'center' })
         .moveDown();

      doc.fontSize(12)
         .font('Helvetica')
         .text(content);

      doc.end();
    } catch (error) {
      reject(new Error(`Error al generar PDF: ${error.message}`));
    }
  });
};

module.exports = {
  generatePDF,
  generateSimplePDF
};
