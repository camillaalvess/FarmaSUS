const { Router } = require('express');
const ubsController = require('../controllers/ubsController');

const router = Router();

// Endpoint chamado por /api/medicamentos
router.get('/medicamentos', (req, res) => ubsController.buscarUbs(req, res));
router.get('/ubs', (req, res) => ubsController.buscarUbs(req, res));

module.exports = router;