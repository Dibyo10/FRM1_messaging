import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

serve(async (req) => {
  const bodyText = await req.text()
  const params = new URLSearchParams(bodyText)
  const incomingMsg = params.get('Body') || ''

  console.log('Incoming WhatsApp message:', incomingMsg)

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: incomingMsg }]
    })
  })

  const { choices } = await openaiRes.json()
  const botReply = choices?.[0]?.message?.content || 'Sorry, something went wrong.'
  const safeReply = escapeXml(botReply)

  console.log('Replying with:', botReply)

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safeReply}</Message></Response>`,
    {
      headers: { 'Content-Type': 'text/xml' },
      status: 200
    }
  )
})
