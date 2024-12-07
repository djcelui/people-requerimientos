import { NextResponse } from 'next/server'
import { openDb } from '@/app/lib/db'

export async function GET() {
  const db = await openDb()
  const forms = await db.all('SELECT * FROM forms')
  await db.close()
  return NextResponse.json(forms)
}

export async function POST(request: Request) {
  const body = await request.json()
  const db = await openDb()
  const result = await db.run(`
    INSERT INTO forms (tipo, pais, fechaIngreso, cliente, canal, cargaHoraria, horarioIn, horarioOut, diasLibres, area, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [body.tipo, body.pais, body.fechaIngreso, body.cliente, body.canal, body.cargaHoraria, body.horarioIn, body.horarioOut, body.diasLibres, body.area, body.estado])
  await db.close()
  return NextResponse.json({ message: 'Form saved successfully', id: result.lastID }, { status: 201 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const db = await openDb()
  await db.run('DELETE FROM forms WHERE id = ?', id)
  await db.close()
  return NextResponse.json({ message: 'Form deleted successfully' })
}

