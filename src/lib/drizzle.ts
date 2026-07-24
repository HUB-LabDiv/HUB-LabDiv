import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// A URL do banco de dados deve obrigatoriamente apontar para a porta do Supavisor (ex: 6543)
// e estar configurada para Transaction Mode no painel do Supabase.
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing DATABASE_URL (Supavisor string) in environment variables');
}

// Configuração CRÍTICA da Arquitetura Antigravity:
// Limitamos o pool do client para estritamente 57 conexões,
// reservando 3 conexões de segurança do limite de 60 do Supabase.
// prepare: false é OBRIGATÓRIO quando usamos PgBouncer/Supavisor em Transaction mode.
const client = postgres(connectionString, {
  prepare: false,
  max: 57,
  idle_timeout: 20, // Fecha conexões inativas após 20 segundos
});

// A instância do Drizzle pronta para uso em Server Actions ou Route Handlers
export const db = drizzle(client);
