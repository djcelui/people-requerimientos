import { NextResponse } from 'next/server'
import { openDb, getNextLoteId, getNextRequisitionId } from '@/app/lib/db'

export async function GET() {
  const db = await openDb()
  const solicitudes = await db.all('SELECT * FROM solicitudes ORDER BY lote_id, requisition_id')
  await db.close()
  return NextResponse.json(solicitudes)
}

export async function POST(request: Request) {
  const body = await request.json()
  const lote_id = await getNextLoteId()
  const db = await openDb()

  const results = []

  for (const solicitud of Array.isArray(body) ? body : [body]) {
    const requisition_id = await getNextRequisitionId()
    const result = await db.run(`
      INSERT INTO solicitudes (lote_id, requisition_id, tipo, pais, fechaIngreso, cliente, canal, cargaHoraria, horarioIn, horarioOut, diasLibres, area, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [lote_id, requisition_id, solicitud.tipo, solicitud.pais, solicitud.fechaIngreso, solicitud.cliente, solicitud.canal, solicitud.cargaHoraria, solicitud.horarioIn, solicitud.horarioOut, solicitud.diasLibres, solicitud.area, solicitud.estado])

    results.push({
      id: result.lastID,
      lote_id,
      requisition_id,
      ...solicitud
    })
  }

  await db.close()

  return NextResponse.json({ message: 'Solicitudes creadas exitosamente', results }, { status: 201 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const db = await openDb()
  await db.run('DELETE FROM solicitudes WHERE id = ?', id)
  await db.close()
  return NextResponse.json({ message: 'Solicitud eliminada exitosamente' })
}

