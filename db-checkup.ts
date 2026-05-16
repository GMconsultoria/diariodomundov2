import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema.js"; // adjust path if needed
import { sql } from "drizzle-orm";
import "dotenv/config";

async function checkup() {
  console.log("Iniciando checkup do banco de dados...");
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ ERRO: Variável DATABASE_URL não encontrada no ambiente.");
    process.exit(1);
  }

  try {
    console.log(`Testando conexão com: ${connectionString.split("@")[1] || "URL ofuscada"}`);
    
    // Configuração do cliente Postgres
    const client = postgres(connectionString, {
      max: 1, // apenas uma conexão para teste
      connect_timeout: 10,
    });
    
    const db = drizzle(client, { schema });
    
    // Tenta rodar uma query simples
    const result = await db.execute(sql`SELECT now();`);
    console.log("✅ Conexão bem sucedida!", result[0]);

    // Verifica se a tabela users existe
    console.log("Verificando tabelas...");
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck[0]?.exists) {
      console.log("✅ Tabela 'users' encontrada no Supabase!");
    } else {
      console.log("❌ ERRO: Tabela 'users' não existe. Você precisa rodar 'npx drizzle-kit push'.");
    }
    
    console.log("Checkup finalizado com sucesso!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Falha na conexão ou na query:");
    console.error(err.message);
    if (err.message.includes("ENOTFOUND")) {
      console.error("\n[DICA]: O erro ENOTFOUND indica que o Vercel não conseguiu encontrar o endereço do banco de dados (provavelmente por falta de suporte a IPv6 ou URL incorreta).");
      console.error("Para corrigir, no painel do Supabase vá em Settings -> Database -> Connection String e ative o 'Use connection pooling'. Copie a URL do Pooler (ela deve ter a porta 6543) e substitua sua DATABASE_URL na Vercel.");
    }
    process.exit(1);
  }
}

checkup();
