# INVolt Website — Functional Fixes Summary

All changes are **functional only** — no visual design changes were made. The INVolt visual design remains locked.

---

## ✅ What Was Done

### 1. Distributor Enquiry System — FormSubmit AJAX + WhatsApp Fast-Track
The API gateway at [`route.ts`](file:///c:/Users/Lokesh/Downloads/Involt_EV_3D_Website/app/api/distributor-enquiry/route.ts) connects directly to FormSubmit AJAX:

- **Server-side only** — The FormSubmit request is executed server-side via `fetch('https://formsubmit.co/ajax/{ENQUIRY_RECIPIENT_EMAIL}')`.
- **Recipient**: configured via `ENQUIRY_RECIPIENT_EMAIL=involtintegrated@gmail.com` in environment variables.
- **Unique Reference ID**: Generated server-side with format `INV-XXXXXX` (6 uppercase alphanumeric characters). Returned in API response and sent with FormSubmit payload.
- **Structured Email Payload**:
  - `_subject`: `New INVolt Distributor Enquiry — {REFERENCE_ID}`
  - `_template`: `table`
  - `_captcha`: `false`
  - `_replyto`: customer's submitted email
  - `Reference ID`: `INV-XXXXXX`
  - `Name`: submitted name
  - `Email`: submitted email
  - `Phone`: submitted phone
  - `Source`: `INVolt Website`
  - `Submission Time`: Indian Standard Time formatted timestamp
  - `Product / Context`: submitted context / model
  - `Requirements`: submitted requirements
- **Error Handling**: FormSubmit failures handled cleanly; no internal stack traces or technical errors exposed to customer.
- **Rate Limiting & Duplicate Protection**: 30-second server cooldown per email and 5-second client duplicate submission prevention.

### 2. WhatsApp Fast-Track Follow-up
Upon successful form submission:
- The UI transitions to a dedicated success card displaying:
  - **Enquiry Submitted Successfully**
  - **Your enquiry has been received.**
  - **Reference ID: INV-XXXXXX**
  - **Follow up on WhatsApp** button.
- The WhatsApp button dynamically generates a pre-filled, URL-encoded message:
  ```text
  Hello INVolt,

  I just submitted an enquiry through the INVolt website.

  Reference ID: INV-XXXXXX

  Name: <Name>
  Email: <Email>
  Phone: <Phone>

  Product/Context: <Product>
  Requirements: <Requirements>

  I would like to follow up regarding my enquiry.
  ```
- Uses business WhatsApp number configured via `NEXT_PUBLIC_WHATSAPP_NUMBER` (`918669668665`).

### 3. Home Popup & Contact Page Integration
- ✅ **Home Popup** ([`distributor-popup.tsx`](file:///c:/Users/Lokesh/Downloads/Involt_EV_3D_Website/components/distributor-popup.tsx)): Triggered after 20 seconds or 40% page scroll, once per browser session. On successful submission, displays Reference ID, WhatsApp follow-up button, and Close button.
- ✅ **Contact Page** ([`page.tsx`](file:///c:/Users/Lokesh/Downloads/Involt_EV_3D_Website/app/contact/page.tsx)): Uses the same `DistributorForm` component and same API endpoint.

---

## ⚙️ Environment Variables

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `ENQUIRY_RECIPIENT_EMAIL` | Recipient email address for FormSubmit leads (server-only) | `involtintegrated@gmail.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp number (public client-safe) | `918669668665` |

