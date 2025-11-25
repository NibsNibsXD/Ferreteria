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
    const productos = await alertasService.getAllProductsConStockMinimo();
    res.status(200).json({
      success: true,
      data: productos
    });
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
  getAllProductsConStockMinimo
};
