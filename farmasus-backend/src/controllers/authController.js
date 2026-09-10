const authService = require('../services/authService');

class AuthController {
  async cadastrar(req, res) {
    try {
      const { email, password, nome } = req.body;
      const resultado = await authService.registrar(email, password, nome);
      return res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso!',
        dados: resultado
      });
    } catch (error) {
      return res.status(400).json({ sucesso: false, mensagem: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const resultado = await authService.autenticar(email, password);
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        token: resultado.session?.access_token,
        usuario: resultado.user
      });
    } catch (error) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas: ' + error.message });
    }
  }
}

module.exports = new AuthController();