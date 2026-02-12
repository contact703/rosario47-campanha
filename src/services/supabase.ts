/**
 * Cliente Supabase para a Rede Social de Militância
 * 
 * CONFIGURAÇÃO:
 * 1. Crie um projeto no Supabase: https://supabase.com
 * 2. Copie a URL e anon key do projeto
 * 3. Cole abaixo ou configure via variáveis de ambiente
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ⚠️ PREENCHER COM SUAS CREDENCIAIS
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'SUA_ANON_KEY';

// Cliente Supabase
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Verificar se está configurado
export function isConfigured(): boolean {
  return !SUPABASE_URL.includes('SEU_PROJETO') && !SUPABASE_ANON_KEY.includes('SUA_ANON_KEY');
}

// Log de status
if (!isConfigured()) {
  console.warn('⚠️ Supabase não configurado! Configure SUPABASE_URL e SUPABASE_ANON_KEY');
}

export default supabase;
