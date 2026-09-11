const { Router } = require('express');
const ubsController = require('../controllers/ubsController'); // ou o nome do seu controller

const router = Router();

// Escuta a chamada do frontend para buscar medicamentos
router.get('/medicamentos', ubsController.buscarMedicamentos || ubsController.listar || ubsController.buscar);
router.get('/ubs', ubsController.listarTodas || ubsController.listar);

module.exports = router;