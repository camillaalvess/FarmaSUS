const authRepository = require('../repositories/authRepository');

class AuthService {
  async registrar(email, password, nome) {
    if (!email || !password || !nome) {
      throw new Error('E-mail, senha e nome são obrigatórios.');
    }
    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
    }
    return await authRepository.cadastrarUsuario(email, password, nome);
  }

  async autenticar(email, password) {
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios.');
    }
    return await authRepository.realizarLogin(email, password);
  }

  async solicitarRedefinicao(email) {
    if (!email) {
      throw new Error('O e-mail é obrigatório para redefinir a senha.');
    }
    return await authRepository.solicitarRedefinicaoSenha(email);
  }
}

module.exports = new AuthService();