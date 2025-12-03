const ExcelJS = require('exceljs');

/**
 * Genera un archivo Excel a partir de datos tabulares
 * @param {Object} options - Opciones de exportación
 * @param {string} options.title - Título del reporte (nombre de la hoja)
 * @param {Array<Object>} options.columns - Definición de columnas [{header: 'Nombre', key: 'nombre', width: 20}]
 * @param {Array<Object>} options.data - Datos a exportar (arreglo de objetos)
 * @param {string} options.fileName - Nombre del archivo (opcional)
 * @returns {Promise<Buffer>} - Buffer del archivo Excel
 */
const generateExcel = async ({ title = 'Reporte', columns, data, fileName = 'reporte.xlsx' }) => {
  try {
    // Crear un nuevo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Configurar columnas
    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key,
      width: col.width || 15
    }));

    // Estilo para el encabezado
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos
    data.forEach(row => {
      worksheet.addRow(row);
    });

    // Ajustar ancho de columnas si no se especificó
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Aplicar bordes a todas las celdas con datos
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: false }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Congelar primera fila (encabezado)
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    throw new Error(`Error al generar Excel: ${error.message}`);
  }
};

/**
 * Genera un Excel con múltiples hojas
 * @param {Array<Object>} sheets - Arreglo de hojas [{title, columns, data}]
 * @returns {Promise<Buffer>} - Buffer del archivo Excel
 */
const generateMultiSheetExcel = async (sheets) => {
  try {
    const workbook = new ExcelJS.Workbook();

    for (const sheet of sheets) {
      const worksheet = workbook.addWorksheet(sheet.title || 'Hoja');

      // Configurar columnas
      worksheet.columns = sheet.columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 15
      }));

      // Estilo para el encabezado
      worksheet.getRow(1).font = { bold: true, size: 12 };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Agregar datos
      sheet.data.forEach(row => {
        worksheet.addRow(row);
      });

      // Aplicar bordes
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        row.eachCell({ includeEmpty: false }, cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Congelar primera fila
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    throw new Error(`Error al generar Excel multi-hoja: ${error.message}`);
  }
};

module.exports = {
  generateExcel,
  generateMultiSheetExcel
};
