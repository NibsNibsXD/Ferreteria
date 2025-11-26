const alertasService = require('../services/alertasBajoStock.service');

const getCantProductosAgotados = async (req, res) => {
  try {
    const resultado = await alertasService.getCantProductosAgotados();
    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getCantConStockEnMinimo = async (req, res) => {
  try {
    const resultado = await alertasService.getCantConStockEnMinimo();
    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getAllProductsConStockMinimo = async (req, res) => {
  try {
    const { limit } = req.query;
    const resultado = await alertasService.getAllProductsConStockMinimo({ limit });
    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


const downloadExcelBajoStock = async (req, res) => {
  try {
    const buffer = await alertasService.getExcelProductosBajoStock();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="productos_bajo_stock.xlsx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getCantProductosAgotados,
  getCantConStockEnMinimo,
  getAllProductsConStockMinimo,
  downloadExcelBajoStock
};
