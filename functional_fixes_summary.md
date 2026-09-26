# INVolt Website — Functional Fixes Summary

All changes are **functional only** — no design changes were made.

---

## ✅ What Was Done

### 1. Distributor Email System — Resend Only
The API route at [`route.ts`](file:///c:/Users/Lokesh/Downloads/Involt_EV_3D_Website/app/api/distributor-enquiry/route.ts) has been implemented using the official Resend SDK:

- **Server-side only** — Resend API key is read from `process.env.RESEND_API_KEY` (never exposed to client)
- **Exact email format** per spec:
  ```
  New Distributor Enquiry

  Name: <name>
  Email: <email>
  Phone: <phone>

  Source: INVolt Website
  ```
- **Reply-To** set to customer's submitted email
- **Recipient** set to `involtintegrated@gmail.com`
- **Sender (From)**: authenticated Resend sender (`onboarding@resend.dev` or custom `RESEND_FROM`)
- **Subject**: "New INVolt Distributor Enquiry"
- **Error handling**: Technical errors logged server-side; customer sees only "Unable to send your enquiry right now. Please try again."
- **No credentials** ever exposed to the frontend

### 2. Validation — Strengthened

**Server-side** ([`route.ts`](file:///c:/Users/Lokesh/Downloads/Involt_EV_3D_Website/app/api/distributor-enquiry/route.ts)):
- Name: required, trimmed, 2–100 characters
- Email: required, valid format
- Phone: required, accepts Indian formats (+91, 91, 0 prefix + 10 digits starting 6-9)
- Rate limiting: 30-second cooldown per email address

**Client-side** ([`distributor-form.tsx`](file:///c:/Users/Lokesh/Downloads/Involt_EV_3D_Website/components/distributor-form.tsx)):
- Same validation rules mirrored on client
- 5-second duplicate submission prevention
- `noValidate` + custom validation UX
- Placeholder text and autocomplete attributes added

### 3. Credential Storage — Correct
- No `.env` committed (already in `.gitignore`)
- No `NEXT_PUBLIC_` or `VITE_` prefixes
- No frontend environment variables containing email secrets
- Server reads: `RESEND_API_KEY`

### 4–8. Already Working (Verified)
- ✅ **Popup** appears immediately, once per session, dismissable
- ✅ **Contact page** uses same `DistributorForm` and same API endpoint
- ✅ **Green marquee** animated with CSS keyframes, respects `prefers-reduced-motion`
- ✅ **Mobile hero order**: text → video → buttons (CSS `order` properties)
- ✅ **Contact details** at bottom of home page with clickable `mailto:` and `tel:` links

---

## ⚠️ Required: Vercel Environment Variables

> [!IMPORTANT]
> For emails to work in production, add `RESEND_API_KEY` in your Vercel dashboard:

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | Your Resend API key (`re_...`) |
| `RESEND_FROM` *(optional)* | Custom sender if domain is verified (defaults to `onboarding@resend.dev`) |

### How to add to Vercel:
1. Go to your Vercel project dashboard
2. **Settings → Environment Variables**
3. Add `RESEND_API_KEY`
4. Select **Production** (and optionally Preview/Development)
5. Click Save
6. **Redeploy** the project
