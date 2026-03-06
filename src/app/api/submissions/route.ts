import { NextRequest, NextResponse } from 'next/server';
import { initDb, insertSubmission, getSubmissions } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const data = await request.json();

    // Validate required fields
    const required = [
      'full_name', 'title', 'email', 'organization', 'company_size',
      'annual_revenue', 'main_client_type', 'has_sales_team', 'main_sales_channels',
      'has_icp', 'has_usp', 'has_service_offering', 'biggest_challenge',
      'tried_sales_function', 'one_thing_to_change', 'monthly_budget',
      'urgency', 'preferred_contact'
    ];

    for (const field of required) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Convert arrays to comma-separated strings
    if (Array.isArray(data.annual_revenue)) data.annual_revenue = data.annual_revenue.join(', ');
    if (Array.isArray(data.main_sales_channels)) data.main_sales_channels = data.main_sales_channels.join(', ');

    const result = await insertSubmission(data);
    return NextResponse.json({ success: true, id: result.id }, { status: 201 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDb();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const data = await getSubmissions(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
