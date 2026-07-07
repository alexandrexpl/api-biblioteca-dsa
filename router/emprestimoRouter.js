const express = require('express');
const router = express.Router();
const emprestimoController = require('../controller/emprestimoController');

router.post('/emprestimos', emprestimoController.criar);
router.get('/emprestimos', emprestimoController.listarTodos);
router.get('/emprestimos/:id', emprestimoController.buscarPorId);
router.put('/emprestimos/:id/devolver', emprestimoController.devolver);
router.delete('/emprestimos/:id', emprestimoController.deletar);

module.exports = router;
