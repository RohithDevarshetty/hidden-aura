import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@hiddenura.com',
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error('Resend email error:', response.error);
      return { success: false, error: response.error };
    }

    console.log('Email sent successfully:', response.data?.id);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

export const sendAnswerNotification = async (
  to: string,
  username: string,
  questionText: string,
  answerText: string,
  profileUrl: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #88c0d0 0%, #a3e635 100%); padding: 20px; border-radius: 10px 10px 0 0;">
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
          <p style="color: #333; font-size: 14px; margin: 0;">${answerText}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${profileUrl}" style="background: #88c0d0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            View Answer
          </a>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
          This is an automated message from HiddenAura. You received this email because answers are enabled in your notification preferences.
        </p>
      </div>
    </div>
  `;

  return sendEmail(to, `New answer to your question`, html);
};
