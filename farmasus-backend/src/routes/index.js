const { Router } = require('express');
const ubsRoutes = require('./ubsRoutes');
const reporteRoutes = require('./reporteRoutes');

const router = Router();

router.use('/api', ubsRoutes);
router.use('/api', reporteRoutes);

module.exports = router;