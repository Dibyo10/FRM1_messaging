import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { phoneNumber, channel = 'sms' } = await req.json()

    if (!['sms', 'whatsapp'].includes(channel)) {
      throw new Error('Invalid channel. Must be "sms" or "whatsapp"')
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const verifySid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')

    if (!accountSid || !authToken || !verifySid) {
      throw new Error('Missing Twilio credentials')
    }

    const formattedNumber = channel === 'whatsapp' ? `whatsapp:${phoneNumber}` : phoneNumber

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${verifySid}/Verifications`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedNumber,
          Channel: channel
        })
      }
    )

    const result = await response.json()

    return new Response(
      JSON.stringify({
        success: true,
        status: result.status,
        channel: result.channel
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Verification error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: corsHeaders }
    )
  }
})
