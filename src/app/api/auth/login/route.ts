import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { initDb } from '@/lib/db';
import { createToken, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Check if any admin exists, if not create the first one
    const admins = await sql`SELECT COUNT(*) as count FROM admin_users`;
    if (parseInt(admins.rows[0].count) === 0) {
      // First login creates admin account
      const hash = await hashPassword(password);
      await sql`INSERT INTO admin_users (username, password_hash) VALUES (${username}, ${hash})`;
    }

    // Verify credentials
    const user = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
    if (user.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.rows[0].password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken(username);
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
