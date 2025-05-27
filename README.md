# FRM1_messaging 📲

This project integrates **Supabase Edge Functions** with **Twilio SMS API** to enable phone number verification and chatbot-based interaction via SMS.

## 🔧 Tech Stack

- **Supabase Edge Functions** (TypeScript)
- **Twilio** (for SMS and verification)
- **Node.js** (TypeScript runtime for Supabase functions)
- **Supabase CLI** for local development & deployment

---

## 📁 Folder Structure

supabase/
└── functions/
├── send_verification_code/
│ └── index.ts
├── check_verification_code/
│ └── index.ts
└── sms_webhook/
└── index.ts


---

## 🚀 Deployed Edge Functions

### 1. `send_verification_code`

- Sends a Twilio verification code to a given phone number.
- Triggered via a `POST` request.
- Uses Twilio Verify API.

### 2. `check_verification_code`

- Verifies the code sent to the phone.
- Confirms user identity using Twilio Verify API.

### 3. `sms_webhook`

- Receives incoming SMS messages from Twilio.
- Responds via webhook with custom replies (e.g., chatbot logic).

---

## 🧪 Local Development

```bash
# Start Supabase locally
supabase start

# Deploy a function
supabase functions deploy send_verification_code
supabase functions deploy check_verification_code
supabase functions deploy sms_webhook
