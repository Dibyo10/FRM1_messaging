import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { phoneNumber, code } = await req.json()
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')!
  const serviceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')!

  const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `To=${phoneNumber}&Code=${code}`
  })

  const data = await res.json()
  if (data.status === 'approved') {
    return new Response(JSON.stringify({ verified: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ verified: false }), { status: 401 })
})
