import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, trialEndDate } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trialEnd = new Date(trialEndDate);
    const formattedDate = trialEnd.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const { data, error } = await resend.emails.send({
      from: 'Travira <welcome@travira.org>',
      to: [userEmail],
      subject: '🎉 Your 7-day free trial has started!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #045530; font-size: 28px; margin: 0;">Welcome to Travira!</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Your personalized flight deals are ready</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #045530, #034a2a); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">🎉 Free Trial Active</h2>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your 7-day free trial ends on ${formattedDate}</p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #045530; margin: 0 0 15px 0;">What you get with your trial:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">3-4 personalized flight deals per week</li>
              <li style="margin-bottom: 8px;">AI finds deals up to 90% off regular prices</li>
              <li style="margin-bottom: 8px;">Detailed city guides and activities</li>
              <li style="margin-bottom: 8px;">Flexible date suggestions</li>
              <li style="margin-bottom: 8px;">Price drop alerts</li>
              <li style="margin-bottom: 8px;">Priority customer support</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #045530; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Start Finding Deals
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">Questions? Reply to this email or contact us at support@travira.org</p>
            <p style="margin: 10px 0 0 0;">© 2024 Travira. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending trial email:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });

  } catch (error) {
    console.error('Error in trial email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
