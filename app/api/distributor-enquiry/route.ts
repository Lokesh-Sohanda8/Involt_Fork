import { NextResponse } from 'next/server';

export async function GET() {
  const recipientEmail = (process.env.ENQUIRY_RECIPIENT_EMAIL || 'involtintegrated@gmail.com').trim();
  
  return NextResponse.json({
    recipientEmail
  });
}
