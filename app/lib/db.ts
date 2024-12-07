import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPath = './users.db'

export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

export async function initDb() {
  const db = await openDb()
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      active INTEGER NOT NULL,
      last_login DATETIME,
      permissions TEXT
    );

    CREATE TABLE IF NOT EXISTS solicitudes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lote_id TEXT,
      requisition_id TEXT UNIQUE,
      tipo TEXT,
      pais TEXT,
      fechaIngreso TEXT,
      cliente TEXT,
      canal TEXT,
      cargaHoraria TEXT,
      horarioIn TEXT,
      horarioOut TEXT,
      diasLibres TEXT,
      area TEXT,
      estado TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  await db.close()
}

export async function getNextLoteId() {
  const db = await openDb()
  const result = await db.get('SELECT MAX(CAST(SUBSTR(lote_id, 5, 4) AS INTEGER)) as max_num FROM solicitudes')
  await db.close()
  
  const nextNum = (result?.max_num || 0) + 1
  const date = new Date()
  const dateString = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  
  return `LOT-${String(nextNum).padStart(4, '0')}-${dateString}`
}

export async function getNextRequisitionId() {
  const db = await openDb()
  const result = await db.get('SELECT MAX(CAST(SUBSTR(requisition_id, 4) AS INTEGER)) as max_num FROM solicitudes')
  await db.close()
  
  const nextNum = (result?.max_num || 0) + 1
  return `RQ-${String(nextNum).padStart(5, '0')}`
}

export async function getNextRequisitionIds(count: number) {
  const db = await openDb()
  const result = await db.get('SELECT MAX(CAST(SUBSTR(requisition_id, 4) AS INTEGER)) as max_num FROM solicitudes')
  await db.close()
  
  const startNum = (result?.max_num || 0) + 1
  return Array.from({ length: count }, (_, i) => `RQ-${String(startNum + i).padStart(5, '0')}`)
}

