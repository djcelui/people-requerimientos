import { NextRequest, NextResponse } from 'next/server'
import { openDb } from '@/app/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, role, active } = body
    const id = params.id

    const db = await openDb()
    await db.run(
      'UPDATE users SET name = ?, email = ?, role = ?, active = ? WHERE id = ?',
      [name, email, role, active ? 1 : 0, id]
    )
    await db.close()

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const db = await openDb()
    await db.run('DELETE FROM users WHERE id = ?', id)
    await db.close()

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

