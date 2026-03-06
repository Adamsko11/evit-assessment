import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { initDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await initDb();
    const result = await sql`SELECT * FROM submissions ORDER BY created_at DESC`;

    // Generate CSV
    if (result.rows.length === 0) {
      return new NextResponse('No data to export', { status: 404 });
    }

    const headers = Object.keys(result.rows[0]);
    const csvRows = [
      headers.join(','),
      ...result.rows.map(row =>
        headers.map(h => {
          const val = String(row[h] || '').replace(/"/g, '""');
          return `"${val}"`;
        }).join(',')
      )
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="evit-submissions-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
