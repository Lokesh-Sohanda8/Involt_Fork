import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simple in-memory rate limiter (per server instance)
const recentSubmissions = new Map<string, number>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const lastSubmission = recentSubmissions.get(email);
  if (lastSubmission && now - lastSubmission < 30_000) {
    return true; // 30-second cooldown per email
  }
  recentSubmissions.set(email, now);
  if (recentSubmissions.size > 500) {
    for (const [key, time] of recentSubmissions) {
      if (now - time > 60_000) recentSubmissions.delete(key);
    }
  }
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // --- Validation ---

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Name is required.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid name (2–100 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const trimmedPhone = phone.trim().replace(/[\s\-().]/g, '');
    if (!isValidPhone(trimmedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid phone number.' },
        { status: 400 }
      );
    }

    // --- Rate limiting ---
    if (isRateLimited(trimmedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please wait before submitting again.' },
        { status: 429 }
      );
    }

    // --- Check Resend API Key ---
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      console.error('[distributor-enquiry] RESEND_API_KEY is not configured on the server.');
      return NextResponse.json(
        { success: false, message: 'Email service is currently unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    // --- Initialize Resend client ---
    const resend = new Resend(apiKey);

    const fromAddress = process.env.RESEND_FROM?.trim() || 'onboarding@resend.dev';
    const recipient = (process.env.DISTRIBUTOR_RECIPIENT_EMAIL || 'involtintegrated@gmail.com').trim();
    const subject = 'New INVolt Distributor Enquiry';

    const textBody = [
      'New Distributor Enquiry',
      '',
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      `Phone: ${trimmedPhone}`,
      '',
      'Source: INVolt Website',
    ].join('\n');

    const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New INVolt Distributor Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
  <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #111111; font-size: 20px; font-weight: 700;">New Distributor Enquiry</h2>
    <p style="margin: 4px 0 0 0; color: #666666; font-size: 13px;">Received via INVolt EV Website</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 10px 0; font-weight: 600; width: 100px; color: #444444; border-bottom: 1px solid #f0f0f0;">Name:</td>
      <td style="padding: 10px 0; color: #111111; border-bottom: 1px solid #f0f0f0;">${trimmedName}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600; color: #444444; border-bottom: 1px solid #f0f0f0;">Email:</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${trimmedEmail}" style="color: #ea580c; text-decoration: none;">${trimmedEmail}</a></td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600; color: #444444; border-bottom: 1px solid #f0f0f0;">Phone:</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="tel:${trimmedPhone}" style="color: #ea580c; text-decoration: none;">${trimmedPhone}</a></td>
    </tr>
  </table>
  <div style="border-top: 1px solid #eeeeee; padding-top: 16px; font-size: 12px; color: #888888;">
    <p style="margin: 0;">Source: INVolt Website</p>
    <p style="margin: 4px 0 0 0;">Reply directly to this email to respond to the applicant.</p>
  </div>
</body>
</html>`;

    console.log('[distributor-enquiry] Sending distributor enquiry email via Resend...');

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [recipient],
      replyTo: trimmedEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (error || !data?.id) {
      console.error('[distributor-enquiry] Resend API rejected email send:', {
        name: error?.name,
        message: error?.message,
      });

      return NextResponse.json(
        { success: false, message: 'Unable to send your enquiry right now. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`[distributor-enquiry] Email sent successfully via Resend. Message ID: ${data.id}`);

    return NextResponse.json({
      success: true,
      message: 'Your distributor enquiry has been sent successfully.',
    });
  } catch (error: any) {
    console.error('[distributor-enquiry] Unexpected server error:', {
      message: error?.message,
    });

    return NextResponse.json(
      { success: false, message: 'Unable to send your enquiry right now. Please try again.' },
      { status: 500 }
    );
  }
}
