import { sql } from '@vercel/postgres';

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW(),
      full_name TEXT NOT NULL,
      linkedin_profile TEXT,
      title TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT NOT NULL,
      company_size TEXT NOT NULL,
      annual_revenue TEXT NOT NULL,
      main_client_type TEXT NOT NULL,
      has_sales_team TEXT NOT NULL,
      main_sales_channels TEXT NOT NULL,
      has_icp TEXT NOT NULL,
      has_usp TEXT NOT NULL,
      icp_description TEXT,
      has_service_offering TEXT NOT NULL,
      service_offering_description TEXT,
      biggest_challenge TEXT NOT NULL,
      tried_sales_function TEXT NOT NULL,
      one_thing_to_change TEXT NOT NULL,
      monthly_budget TEXT NOT NULL,
      urgency TEXT NOT NULL,
      preferred_contact TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function insertSubmission(data: Record<string, string>) {
  const result = await sql`
    INSERT INTO submissions (
      full_name, linkedin_profile, title, email, organization,
      company_size, annual_revenue, main_client_type,
      has_sales_team, main_sales_channels, has_icp, has_usp,
      icp_description, has_service_offering, service_offering_description,
      biggest_challenge, tried_sales_function, one_thing_to_change,
      monthly_budget, urgency, preferred_contact
    ) VALUES (
      ${data.full_name}, ${data.linkedin_profile || ''}, ${data.title}, ${data.email}, ${data.organization},
      ${data.company_size}, ${data.annual_revenue}, ${data.main_client_type},
      ${data.has_sales_team}, ${data.main_sales_channels}, ${data.has_icp}, ${data.has_usp},
      ${data.icp_description || ''}, ${data.has_service_offering}, ${data.service_offering_description || ''},
      ${data.biggest_challenge}, ${data.tried_sales_function}, ${data.one_thing_to_change},
      ${data.monthly_budget}, ${data.urgency}, ${data.preferred_contact}
    )
    RETURNING id
  `;
  return result.rows[0];
}

export async function getSubmissions(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const submissions = await sql`
    SELECT * FROM submissions ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `;
  const countResult = await sql`SELECT COUNT(*) as total FROM submissions`;
  return {
    submissions: submissions.rows,
    total: parseInt(countResult.rows[0].total),
    page,
    totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
  };
}

export async function getSubmissionById(id: number) {
  const result = await sql`SELECT * FROM submissions WHERE id = ${id}`;
  return result.rows[0] || null;
}

export async function deleteSubmission(id: number) {
  await sql`DELETE FROM submissions WHERE id = ${id}`;
}

export async function getStats() {
  const total = await sql`SELECT COUNT(*) as count FROM submissions`;
  const today = await sql`SELECT COUNT(*) as count FROM submissions WHERE created_at >= CURRENT_DATE`;
  const thisWeek = await sql`SELECT COUNT(*) as count FROM submissions WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`;
  const byUrgency = await sql`SELECT urgency, COUNT(*) as count FROM submissions GROUP BY urgency ORDER BY count DESC`;
  const bySize = await sql`SELECT company_size, COUNT(*) as count FROM submissions GROUP BY company_size ORDER BY count DESC`;
  const byBudget = await sql`SELECT monthly_budget, COUNT(*) as count FROM submissions GROUP BY monthly_budget ORDER BY count DESC`;

  return {
    total: parseInt(total.rows[0].count),
    today: parseInt(today.rows[0].count),
    thisWeek: parseInt(thisWeek.rows[0].count),
    byUrgency: byUrgency.rows,
    bySize: bySize.rows,
    byBudget: byBudget.rows
  };
}
