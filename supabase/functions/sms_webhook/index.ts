import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const formData = await req.formData()
  const incomingMsg = formData.get('Body')?.toString() || ''

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

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${botReply}</Message></Response>`,
    {
      headers: { 'Content-Type': 'text/xml' },
      status: 200
    }
  )
})
