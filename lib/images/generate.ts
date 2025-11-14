import satori from 'satori';
import sharp from 'sharp';
import { getTemplateById } from './templates';

export async function generateStoryImage(
  questionText: string,
  username: string,
  templateId: string = 'gradient-sunset'
): Promise<Buffer> {
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error('Template not found');
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1080px',
          height: '1920px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: template.cssConfig.background,
          padding: '120px 80px',
          position: 'relative',
        },
        children: [
          // Question text
          {
            type: 'div',
            props: {
              style: {
                fontSize: template.cssConfig.fontSize || '64px',
                fontWeight: template.cssConfig.fontWeight || '700',
                fontFamily: template.cssConfig.fontFamily || 'Poppins, sans-serif',
                color: template.cssConfig.textColor,
                textAlign: 'center',
                maxWidth: '920px',
                lineHeight: '1.3',
                marginBottom: '100px',
              },
              children: questionText,
            },
          },
          // Call to action
          {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                color: template.cssConfig.textColor,
                textAlign: 'center',
                opacity: 0.9,
                marginBottom: '40px',
              },
              children: 'Answer anonymously',
            },
          },
          // Link
          {
            type: 'div',
            props: {
              style: {
                fontSize: '36px',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif',
                color: template.cssConfig.textColor,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '24px 48px',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              },
              children: `${process.env.NEXT_PUBLIC_APP_NAME || 'yourapp.com'}/@${username}`,
            },
          },
          // Branding (bottom)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '60px',
                fontSize: '20px',
                fontWeight: '400',
                fontFamily: 'Inter, sans-serif',
                color: template.cssConfig.textColor,
                opacity: 0.6,
              },
              children: `Made with ${process.env.NEXT_PUBLIC_APP_NAME || 'AnonAsk'}`,
            },
          },
        ],
      },
    } as any,
    {
      width: 1080,
      height: 1920,
      fonts: [],
    }
  );

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return pngBuffer;
}

export async function generateAnswerImage(
  questionText: string,
  answerText: string,
  username: string,
  templateId: string = 'gradient-sunset'
): Promise<Buffer> {
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error('Template not found');
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1080px',
          height: '1920px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: template.cssConfig.background,
          padding: '120px 80px',
          position: 'relative',
        },
        children: [
          // Question text (smaller)
          {
            type: 'div',
            props: {
              style: {
                fontSize: '36px',
                fontWeight: '600',
                fontFamily: 'Inter, sans-serif',
                color: template.cssConfig.textColor,
                textAlign: 'center',
                maxWidth: '920px',
                marginBottom: '60px',
                opacity: 0.8,
              },
              children: questionText,
            },
          },
          // Answer text (larger)
          {
            type: 'div',
            props: {
              style: {
                fontSize: '52px',
                fontWeight: template.cssConfig.fontWeight || '700',
                fontFamily: template.cssConfig.fontFamily || 'Poppins, sans-serif',
                color: template.cssConfig.textColor,
                textAlign: 'center',
                maxWidth: '920px',
                lineHeight: '1.3',
                marginBottom: '100px',
              },
              children: answerText,
            },
          },
          // Footer with link
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: '400',
                      fontFamily: 'Inter, sans-serif',
                      color: template.cssConfig.textColor,
                      opacity: 0.8,
                      marginBottom: '16px',
                    },
                    children: 'Send me your anonymous answers',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: '600',
                      fontFamily: 'Inter, sans-serif',
                      color: template.cssConfig.textColor,
                    },
                    children: `@${username}`,
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: 1080,
      height: 1920,
      fonts: [],
    }
  );

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return pngBuffer;
}
