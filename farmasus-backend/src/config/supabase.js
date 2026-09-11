const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Aceita SUPABASE_ANON_KEY ou SUPABASE_KEY ou o valor direto de fallback
const supabaseUrl = process.env.SUPABASE_URL || 'https://vyenaqkugitpjfmughqw.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZW5hcWt1Z2l0cGpmbXVnaHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjg3MDYsImV4cCI6MjEwNDY0NDcwNn0.eHJgHS8-ZXvYEf6ObGCEboGOI4rZf6Qxb2p8bI_FC_s';

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ ATENÇÃO: Credenciais do Supabase não foram informadas.');
}

// Cria a instância de conexão com o banco de dados
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;