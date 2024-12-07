import { NextResponse } from 'next/server'
import { openDb } from '@/app/lib/db'
import bcrypt from 'bcrypt'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { name, email, password, permissions, actions } = body

  const db = await openDb()

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.run(
      'UPDATE users SET name = ?, email = ?, password = ?, permissions = ?, actions = ? WHERE id = ?',
      [name, email, hashedPassword, JSON.stringify(permissions), JSON.stringify(actions), params.id]
    )
  } else {
    await db.run(
      'UPDATE users SET name = ?, email = ?, permissions = ?, actions = ? WHERE id = ?',
      [name, email, JSON.stringify(permissions), JSON.stringify(actions), params.id]
    )
  }

  await db.close()

  return NextResponse.json({ message: 'User updated successfully' })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const db = await openDb()
  await db.run('DELETE FROM users WHERE id = ?', params.id)
  await db.close()

  return NextResponse.json({ message: 'User deleted successfully' })
}

