const express = require('express');
const router = express.Router();
const tipoClienteController = require('../controller/tipoClienteController');

router.post('/tipos-cliente', tipoClienteController.criar);
router.get('/tipos-cliente', tipoClienteController.listarTodos);
router.get('/tipos-cliente/:id', tipoClienteController.buscarPorId);
router.put('/tipos-cliente/:id', tipoClienteController.atualizar);
router.delete('/tipos-cliente/:id', tipoClienteController.deletar);

module.exports = router;
