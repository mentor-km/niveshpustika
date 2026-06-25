import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

function last10Digits(value: string | null | undefined) {
  if (!value) return '';
  return value.replace(/\D/g, '').slice(-10);
}

function isAdminSignup(
  authUser: { email?: string | null; phone?: string | null },
  profile: { email?: string | null }
) {
  const adminEmail = (Deno.env.get('ADMIN_NOTIFY_EMAIL') || 'mentor@analystbychance.com').toLowerCase();
  const adminPhone10 = last10Digits(
    Deno.env.get('ADMIN_NOTIFY_PHONE') || '+918109901136'
  );
  const email = (authUser.email || profile.email || '').toLowerCase();
  const phone10 = last10Digits(authUser.phone);
  return (
    (adminEmail && email === adminEmail) ||
    (adminPhone10 && phone10 === adminPhone10)
  );
}

function detectSignupMethod(authUser: {
  phone?: string | null;
  email?: string | null;
  app_metadata?: { provider?: string; providers?: string[] };
}) {
  if (authUser.phone) return 'Phone OTP';
  const providers = authUser.app_metadata?.providers || [];
  if (providers.includes('google')) return 'Google';
  if (authUser.app_metadata?.provider === 'google') return 'Google';
  if (authUser.email) return 'Email/OAuth';
  return 'Unknown';
}

function buildSmsBody(
  method: string,
  authUser: { email?: string | null; phone?: string | null },
  profile: { name?: string | null; email?: string | null }
) {
  const name = profile.name?.trim();
  const identifier = authUser.phone || authUser.email || profile.email || 'unknown';
  const namePart = name ? ` (${name})` : '';
  return `Nivesh Pustika: New signup via ${method}${namePart}. ${identifier}`.slice(0, 160);
}

async function sendTwilioSms(body: string) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');
  const to = Deno.env.get('ADMIN_NOTIFY_PHONE') || '+918109901136';

  if (!accountSid || !authToken || !messagingServiceSid) {
    throw new Error('Twilio not configured for admin notifications');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({
    To: to,
    MessagingServiceSid: messagingServiceSid,
    Body: body,
  });

  const credentials = btoa(`${accountSid}:${authToken}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Twilio error (${res.status})`);
  }
  return data;
}

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const webhookSecret = Deno.env.get('NOTIFY_WEBHOOK_SECRET');
    if (webhookSecret) {
      const provided = req.headers.get('x-webhook-secret');
      if (provided !== webhookSecret) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = (await req.json()) as WebhookPayload;

    if (payload.type !== 'INSERT' || payload.table !== 'profiles' || payload.schema !== 'public') {
      return new Response(JSON.stringify({ ok: true, skipped: 'not a profiles insert' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const profile = payload.record;
    if (!profile?.id) {
      return new Response(JSON.stringify({ error: 'Missing profile id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: userError?.message || 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authUser = userData.user;
    if (isAdminSignup(authUser, profile)) {
      return new Response(JSON.stringify({ ok: true, skipped: 'admin signup' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const method = detectSignupMethod(authUser);
    const body = buildSmsBody(method, authUser, profile);
    const twilio = await sendTwilioSms(body);

    return new Response(
      JSON.stringify({ ok: true, method, sid: twilio.sid }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('notify-new-user error:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
