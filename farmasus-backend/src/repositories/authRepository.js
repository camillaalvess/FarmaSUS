const { createClient } = require('@supabase/supabase-js');

class AuthRepository {
  async cadastrarUsuario(email, password, nome) {
    const supabase = require('../config/supabase');
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
    const supabase = require('../config/supabase');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async solicitarRedefinicaoSenha(email) {
    const supabase = require('../config/supabase');
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://farma-sus.vercel.app'
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async atualizarSenhaUsuario(token, refreshToken, newPassword) {
    // Cria um cliente dedicado e estabelece a sessão ativa usando os tokens
    const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    
    const { error: sessionError } = await client.auth.setSession({
      access_token: token,
      refresh_token: refreshToken || ''
    });

    if (sessionError) throw new Error(`Erro na sessão: ${sessionError.message}`);

    const { data, error } = await client.auth.updateUser({
      password: newPassword
    });

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = new AuthRepository();