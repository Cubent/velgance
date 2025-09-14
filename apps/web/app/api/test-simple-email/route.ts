import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@repo/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      );
    }

    console.log('Testing email with:', {
      from: process.env.RESEND_FROM || 'info@deals.travira.org',
      to: userEmail,
      token: process.env.RESEND_TOKEN ? 'Token exists' : 'No token found'
    });

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'info@deals.travira.org',
      to: [userEmail],
      subject: 'Test Email from Travira',
      html: '<h1>Test Email</h1><p>If you receive this, Resend is working!</p>',
    });

    console.log('Resend result:', result);

    return NextResponse.json({
      success: true,
      message: 'Test email sent',
      result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
