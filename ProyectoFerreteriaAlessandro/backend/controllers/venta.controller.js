const ventaService = require('../services/venta.service');

const getAllVentas = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const ventas = await ventaService.getAllVentas({ page, limit });
    res.status(200).json({
      success: true,
      data: ventas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await ventaService.getVentaById(id);
    res.status(200).json({
      success: true,
      data: venta
    });
  } catch (error) {
    if (error.message === 'Venta no encontrada') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

const createVenta = async (req, res) => {
  try {
    const nuevaVenta = await ventaService.createVenta(req.body);
    res.status(201).json({
      success: true,
      data: nuevaVenta
    });
  } catch (error) {
    const statusCode = error.message.includes('requerido') || 
                       error.message.includes('Ya existe') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const ventaActualizada = await ventaService.updateVenta(id, req.body);
    res.status(200).json({
      success: true,
      data: ventaActualizada
    });
  } catch (error) {
    if (error.message === 'Venta no encontrada') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = {
  getAllVentas,
  getVentaById,
  createVenta,
  updateVenta
};

