import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, verificationLink: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email would be sent to:', email, 'Link:', verificationLink);
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
}

export async function sendAccessCodeEmail(email: string, accessCode: string, username: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Access code email would be sent to:', email, 'Code:', accessCode);
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Your Access Code',
      html: `
        <h1>Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'AnonAsk'}!</h1>
        <p>Your username: <strong>@${username}</strong></p>
        <p>Your access code: <strong style="font-size: 24px; letter-spacing: 2px;">${accessCode}</strong></p>
        <p>Keep this code safe! You'll need it to access your inbox.</p>
        <p>Your profile link: ${process.env.NEXT_PUBLIC_APP_URL}/@${username}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send access code email:', error);
  }
}

export async function sendNewAnswerEmail(
  email: string,
  username: string,
  questionText: string,
  answerPreview: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️  RESEND_API_KEY not configured. Email would be sent to:', email);
    console.log('   Username:', username);
    console.log('   Question:', questionText);
    console.log('   Answer:', answerPreview.substring(0, 50) + '...');
    return;
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'You got a new anonymous answer! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #88c0d0 0%, #a3e635 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">HiddenAura</h1>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hi <strong>@${username}</strong>,</p>

            <p style="color: #555; font-size: 14px;">You received a new anonymous answer!</p>

            <div style="background: white; border-left: 4px solid #88c0d0; padding: 15px; margin: 20px 0;">
              <p style="color: #666; font-size: 13px; margin: 0 0 10px 0;"><strong>Your Question:</strong></p>
              <p style="color: #333; font-size: 14px; margin: 0; font-weight: bold;">${questionText}</p>
            </div>

            <div style="background: white; border-left: 4px solid #a3e635; padding: 15px; margin: 20px 0;">
              <p style="color: #666; font-size: 13px; margin: 0 0 10px 0;"><strong>Answer:</strong></p>
              <p style="color: #333; font-size: 14px; margin: 0;">${answerPreview}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="background: #88c0d0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View All Answers
              </a>
            </div>

            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
              This is an automated message from HiddenAura. You received this email because email notifications are enabled in your preferences.
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ New answer email sent to:', email, '(ID:', result.data?.id, ')');
    return result;
  } catch (error) {
    console.error('❌ Failed to send new answer email:', error);
  }
}

export async function sendMagicLink(email: string, magicLink: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Magic link would be sent to:', email, 'Link:', magicLink);
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Sign in to your account',
      html: `
        <h1>Sign in to ${process.env.NEXT_PUBLIC_APP_NAME || 'AnonAsk'}</h1>
        <p>Click the link below to sign in to your account:</p>
        <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: #FF6B9D; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Sign In
        </a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send magic link:', error);
  }
}
