import { NextResponse } from 'next/server';

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

function generateReferenceId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `INV-${suffix}`;
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

    // --- Generate Reference ID ---
    const referenceId = generateReferenceId();

    // --- Format Submission Timestamp ---
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';

    // --- Recipient Email ---
    const recipientEmail = (process.env.ENQUIRY_RECIPIENT_EMAIL || 'involtintegrated@gmail.com').trim();

    const origin = request.headers.get('origin') || 'https://involt.knowletive.in';
    const referer = request.headers.get('referer') || `${origin}/`;

    const formSubmitPayload = {
      _subject: `New INVolt Distributor Enquiry — ${referenceId}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: trimmedEmail,
      'Reference ID': referenceId,
      'Name': trimmedName,
      'Email': trimmedEmail,
      'Phone': trimmedPhone,
      'Source': (typeof body.source === 'string' && body.source.trim()) ? body.source.trim() : 'INVolt Website',
      'Submission Time': timestamp,
      'Product / Context': (typeof body.product === 'string' && body.product.trim()) ? body.product.trim() : 'General / Multi-Model',
      'Requirements': (typeof body.requirements === 'string' && body.requirements.trim()) ? body.requirements.trim() : 'Distributor enquiry',
    };

    console.log(`[distributor-enquiry] Submitting enquiry ${referenceId} via FormSubmit AJAX...`);

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': origin,
        'Referer': referer,
      },
      body: JSON.stringify(formSubmitPayload),
    });

    const result = await response.json().catch(() => null);

    const isSuccess = response.ok && result && (result.success === 'true' || result.success === true);
    const isActivationPending = result && typeof result.message === 'string' && result.message.toLowerCase().includes('activation');

    if (!isSuccess && !isActivationPending) {
      console.error('[distributor-enquiry] FormSubmit rejected submission:', {
        status: response.status,
        message: result?.message,
      });

      return NextResponse.json(
        { success: false, message: 'Unable to submit your enquiry right now. Please try again.' },
        { status: 500 }
      );
    }

    if (isActivationPending) {
      console.log(`[distributor-enquiry] FormSubmit activation email sent to ${recipientEmail}. Complete first-time activation to receive future leads directly.`);
    } else {
      console.log(`[distributor-enquiry] FormSubmit successfully processed enquiry ${referenceId}`);
    }

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Your distributor enquiry has been submitted successfully.',
    });
  } catch (error: any) {
    console.error('[distributor-enquiry] Unexpected server error:', {
      message: error?.message,
    });

    return NextResponse.json(
      { success: false, message: 'Unable to submit your enquiry right now. Please try again.' },
      { status: 500 }
    );
  }
}
