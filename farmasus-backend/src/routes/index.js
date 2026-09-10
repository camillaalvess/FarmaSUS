const { Router } = require('express');
const ubsRoutes = require('./ubsRoutes');
const reporteRoutes = require('./reporteRoutes');
const authRoutes = require('./authRoutes');

const router = Router();

router.use('/api', ubsRoutes);
router.use('/api', reporteRoutes);
router.use('/api', authRoutes);

module.exports = router;