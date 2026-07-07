const express = require('express');
const router = express.Router();
const clienteController = require('../controller/clienteController');

router.post('/clientes', clienteController.criar);
router.get('/clientes', clienteController.listarTodos);
router.get('/clientes/:id', clienteController.buscarPorId);
router.put('/clientes/:id', clienteController.atualizar);
router.delete('/clientes/:id', clienteController.deletar);

module.exports = router;
