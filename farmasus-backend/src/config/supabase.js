const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ ATENÇÃO: SUPABASE_URL ou SUPABASE_ANON_KEY não foram informadas no arquivo .env');
}

// Cria a instância de conexão com o banco de dados
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;