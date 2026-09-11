const { Router } = require('express');
const ubsRoutes = require('./ubsRoutes');
const reporteRoutes = require('./reporteRoutes');
const authRoutes = require('./authRoutes');

const router = Router();

// As rotas internas já possuem seus prefixos específicos
router.use('/', ubsRoutes);
router.use('/', reporteRoutes);
router.use('/', authRoutes);

module.exports = router;