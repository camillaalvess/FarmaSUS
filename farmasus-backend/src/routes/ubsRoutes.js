const { Router } = require('express');
const ubsController = require('../controllers/ubsController');

const router = Router();

// Endpoint: GET /api/medicamentos?medicamento=Insulina&regiao=Centro
router.get('/medicamentos', ubsController.buscarUbs);

module.exports = router;