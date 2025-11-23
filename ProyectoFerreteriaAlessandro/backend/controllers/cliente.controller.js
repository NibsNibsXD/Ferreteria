const clienteService = require('../services/cliente.service');

/**
 * Obtener todos los clientes
 * GET /api/clientes
 */
const getAllClientes = async (req, res) => {
  try {
    const clientes = await clienteService.getAllClientes();
    res.json({ success: true, data: clientes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Obtener un cliente por ID
 * GET /api/clientes/:id
 */
const getClienteById = async (req, res) => {
  try {
    const cliente = await clienteService.getClienteById(req.params.id);
    res.json({ success: true, data: cliente });
  } catch (error) {
    const statusCode = error.message === 'Cliente no encontrado' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

/**
 * Crear cliente
 * POST /api/clientes
 */
const createCliente = async (req, res) => {
  try {
    const nuevo = await clienteService.createCliente(req.body);
    res.status(201).json({ success: true, message: 'Cliente creado exitosamente', data: nuevo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Actualizar cliente
 * PUT /api/clientes/:id
 */
const updateCliente = async (req, res) => {
  try {
    const actualizado = await clienteService.updateCliente(req.params.id, req.body);
    res.json({ success: true, message: 'Cliente actualizado exitosamente', data: actualizado });
  } catch (error) {
    const statusCode = error.message === 'Cliente no encontrado' ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente
};
