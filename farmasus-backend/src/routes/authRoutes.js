const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.post('/cadastrar', authController.cadastrar);
router.post('/login', authController.login);
router.post('/recuperar-senha', authController.recuperarSenha);
router.post('/redefinir-senha', authController.redefinirSenha);

module.exports = router;