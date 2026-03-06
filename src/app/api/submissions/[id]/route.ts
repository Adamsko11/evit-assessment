import { NextRequest, NextResponse } from 'next/server';
import { initDb, getSubmissionById, deleteSubmission } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await initDb();
    const { id } = await params;
    const submission = await getSubmissionById(parseInt(id));
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await initDb();
    const { id } = await params;
    await deleteSubmission(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
