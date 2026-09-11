const { createClient } = require('@supabase/supabase-js');
const supabase = require('../config/supabase');

class AuthRepository {
  async cadastrarUsuario(email, password, nome) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome_completo: nome }
      }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async realizarLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async solicitarRedefinicaoSenha(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://farma-sus.vercel.app'
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async atualizarSenhaUsuario(token, newPassword) {
    // Cria uma instância temporária autenticada com o Bearer Token do usuário
    const supabaseClientAutenticado = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data, error } = await supabaseClientAutenticado.auth.updateUser({
      password: newPassword
    });

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = new AuthRepository();