import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    if (req.headers.get('Content-Type') !== 'application/json') {
      return new Response('Invalid Content-Type', { status: 400 });
    }

    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return new Response('Phone number is required', { status: 400 });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const serviceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID');

    if (!accountSid || !authToken || !serviceSid) {
      throw new Error('Missing required environment variables');
    }

    const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `To=${phoneNumber}&Channel=sms`,
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      return new Response(`Failed to send verification code: ${errorDetails}`, { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
} catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(`Error: ${errorMessage}`, { status: 500 });
  }
});