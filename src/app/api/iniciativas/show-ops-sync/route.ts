// Este programa é um software livre (Licença AGPLv3)
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAdminSessionRole } from '@/app/actions/admin';

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-hub-sso-signature, x-hub-sso-timestamp',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-store',
  };
}

function verifyServerSignature(request: Request, rawBody: string): boolean {
  const sig = request.headers.get('x-hub-sso-signature');
  const ts = request.headers.get('x-hub-sso-timestamp');
  const secret = process.env.HUB_SSO_SECRET || process.env.ADMIN_SECRET_KEY;
  if (!sig || !ts || !secret) return false;

  const ageSec = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(ageSec) || ageSec > 300) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${ts}.${rawBody}`).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'));
  } catch {
    return false;
  }
}

function getHubDbClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createAdminClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return null;
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin')),
  });
}

export async function GET(request: Request) {
  const headers = corsHeaders(request.headers.get('origin'));
  try {
    const db = getHubDbClient() || (await createServerSupabase());

    const [expRes, intRes, availRes, sessRes, qRes] = await Promise.all([
      db.from('show_experiments').select('slug, maintenance_status, updated_at'),
      db.from('show_experiment_internals').select('experiment_slug, maintenance_notes, updated_at'),
      db.from('show_experiment_availability').select('*').order('created_at', { ascending: false }),
      db
        .from('show_sessions')
        .select('id, booking_code, school_name, is_live, current_experiment_slug')
        .order('is_live', { ascending: false })
        .limit(5),
      db
        .from('show_student_responses')
        .select('id, session_id, student_name, school_origin, free_text_answer, is_highlighted, is_answered, monitor_reply, created_at')
        .order('is_highlighted', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(40),
    ]);

    return NextResponse.json(
      {
        ok: true,
        experiments: expRes.data || [],
        internals: intRes.data || [],
        availabilityRules: availRes.data || [],
        sessions: sessRes.data || [],
        liveQuestions: qRes.data || [],
      },
      { status: 200, headers }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro ao ler estado do Show.' },
      { status: 500, headers }
    );
  }
}

export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get('origin'));
  const rawBody = await request.text().catch(() => '');

  try {
    const isSignedServer = verifyServerSignature(request, rawBody);
    if (!isSignedServer) {
      const adminSession = await getAdminSessionRole();
      const supabase = await createServerSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      const isStaff = adminSession.role === 'admin' || adminSession.role === 'moderator';
      if (!user && !isStaff) {
        return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401, headers });
      }
    }

    const body = rawBody ? JSON.parse(rawBody) : {};
    const db = getHubDbClient() || (await createServerSupabase());
    const action = body.action as string;

    if (action === 'save_experiment' && body.slug) {
      const slug = String(body.slug);
      const status = String(body.status || 'disponivel');
      const notes = typeof body.notes === 'string' ? body.notes : '';

      await db
        .from('show_experiments')
        .update({ maintenance_status: status, updated_at: new Date().toISOString() })
        .eq('slug', slug);

      await db.from('show_experiment_internals').upsert({
        experiment_slug: slug,
        maintenance_notes: notes,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    if (action === 'moderate_question' && body.questionId) {
      const updates: Record<string, unknown> = {};
      if (typeof body.is_highlighted === 'boolean') updates.is_highlighted = body.is_highlighted;
      if (typeof body.is_answered === 'boolean') updates.is_answered = body.is_answered;
      if (typeof body.monitor_reply === 'string') updates.monitor_reply = body.monitor_reply;

      await db.from('show_student_responses').update(updates).eq('id', String(body.questionId));
      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    if (action === 'set_stage_experiment') {
      const experimentSlug = body.experimentSlug ? String(body.experimentSlug) : null;
      const sessionId = body.sessionId ? String(body.sessionId) : null;
      if (sessionId) {
        await db
          .from('show_sessions')
          .update({ current_experiment_slug: experimentSlug, is_live: true })
          .eq('id', sessionId);
      }
      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro ao sincronizar Show.' },
      { status: 500, headers }
    );
  }
}

