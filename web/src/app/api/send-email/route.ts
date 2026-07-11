import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key (it will fall back to dummy if not in env)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_123');

export async function POST(req: Request) {
  try {
    const { email, studentName, credentialId, eventName } = await req.json();

    if (!email || !credentialId) {
      return NextResponse.json({ error: 'Email and Credential ID are required' }, { status: 400 });
    }

    const verificationLink = `https://certifyx.com/c/${credentialId}`;

    // If no real API key is present, just mock the success
    if (!process.env.RESEND_API_KEY) {
      console.log(`[MOCK EMAIL] To: ${email}, Subject: Your Certificate for ${eventName}, Link: ${verificationLink}`);
      return NextResponse.json({ 
        message: 'Email delivery simulated (No RESEND_API_KEY provided)', 
        success: true 
      });
    }

    const data = await resend.emails.send({
      from: 'CertifyX <onboarding@resend.dev>',
      to: email,
      subject: `Your Certificate for ${eventName}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Congratulations, ${studentName || 'Student'}!</h2>
          <p>Your digital certificate for <strong>${eventName}</strong> has been issued on the Stellar blockchain.</p>
          <p>You can view, verify, and download your credential here:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Certificate</a>
          <p style="margin-top: 32px; color: #666; font-size: 12px;">Credential ID: ${credentialId}</p>
        </div>
      `
    });

    return NextResponse.json({ message: 'Email sent successfully', data, success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
