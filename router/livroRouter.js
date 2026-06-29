const express = require('express');
const router = express.Router();
const livroController = require('../controller/livroController');

router.post('/livros', livroController.criar);
router.get('/livros', livroController.listarTodos);
router.get('/livros/:id', livroController.buscarPorId);
router.put('/livros/:id', livroController.atualizar);
router.delete('/livros/:id', livroController.deletar);

module.exports = router;