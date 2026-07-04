const express = require('express');
const router = express.Router();
const autorController = require('../controller/autorController');

router.post('/autores', autorController.criar);
router.get('/autores', autorController.listarTodos);
router.get('/autores/:id', autorController.buscarPorId);
router.put('/autores/:id', autorController.atualizar);
router.delete('/autores/:id', autorController.deletar);

module.exports = router;