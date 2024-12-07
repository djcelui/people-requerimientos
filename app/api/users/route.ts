import { NextResponse } from 'next/server'
import { openDb } from '@/app/lib/db'

export async function GET() {
  try {
    const db = await openDb()
    const users = await db.all('SELECT id, name, email, role, active, last_login FROM users')
    await db.close()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role, active } = body

    const db = await openDb()
    const result = await db.run(
      'INSERT INTO users (name, email, role, active) VALUES (?, ?, ?, ?)',
      [name, email, role, active ? 1 : 0]
    )
    await db.close()

    return NextResponse.json({ id: result.lastID, message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

