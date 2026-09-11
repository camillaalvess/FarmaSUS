const { Router } = require('express');
const reporteController = require('../controllers/reporteController');

const router = Router();

// Endpoint chamado pelo script.js: POST /api/reportar
router.post('/reportar', reporteController.criar);

module.exports = router;