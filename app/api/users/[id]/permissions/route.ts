// app\api\users\[id]\permissions\route.ts
import { NextResponse } from 'next/server'
import { openDb } from '@/app/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const paramsAwaited = await params;
  const db = await openDb()
  // const permissions = await db.get('SELECT permissions FROM users WHERE id = ?', params.id)
  const permissions = await db.get('SELECT permissions FROM users WHERE id = ?', paramsAwaited.id)
  await db.close()

  if (!permissions) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(JSON.parse(permissions.permissions))
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const paramsAwaited = await params;
  const body = await request.json()
  const permissions = JSON.stringify(body)

  const db = await openDb()
  // await db.run('UPDATE users SET permissions = ? WHERE id = ?', [permissions, params.id])
  await db.run('UPDATE users SET permissions = ? WHERE id = ?', [permissions, paramsAwaited.id])
  await db.close()

  return NextResponse.json({ message: 'Permissions updated successfully' })
}

