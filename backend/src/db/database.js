const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Criar diretório database se não existir
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criar banco de dados SQLite
const dbPath = path.join(dbDir, 'agendamentos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir banco de dados:', err);
  } else {
    console.log('✅ Database inicializado em:', dbPath);
  }
});

// Ativar foreign keys
db.run('PRAGMA foreign_keys = ON');

// Criar tabela de agendamentos se não existir
db.serialize(function() {
  db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      os TEXT NOT NULL UNIQUE,
      contrato TEXT,
      cliente TEXT NOT NULL,
      contato TEXT,
      data_agendamento TEXT NOT NULL,
      hora TEXT NOT NULL,
      responsavel TEXT,
      observacoes TEXT,
      status TEXT DEFAULT 'agendado',
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_os ON agendamentos(os)
  `);
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_responsavel ON agendamentos(responsavel)
  `);
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_data_agendamento ON agendamentos(data_agendamento)
  `, (err) => {
    if (err) {
      console.error('Erro ao criar índices:', err);
    } else {
      console.log('✅ Tabelas e índices criados com sucesso');
    }
  });
});

module.exports = db;
