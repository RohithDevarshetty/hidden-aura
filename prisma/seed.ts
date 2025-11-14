import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing templates
  await prisma.template.deleteMany({});

  // Create default templates
  const templates = [
    {
      id: 'glassmorphic-default',
      name: 'Glassmorphic',
      description: 'Modern glass effect with gradient background',
      previewImageUrl: null,
      cssConfig: {
        bgGradient: 'linear-gradient(135deg, rgba(136, 192, 208, 0.3) 0%, rgba(163, 230, 53, 0.3) 100%)',
        text: '#ECEFF4',
        accent: '#8BC0D0',
        fontSize: 26,
        style: 'glassmorphic',
      },
      isPremium: false,
      displayOrder: 1,
    },
    {
      id: 'neon-dark',
      name: 'Neon',
      description: 'Dark background with vibrant neon text',
      previewImageUrl: null,
      cssConfig: {
        bgGradient: '#000000',
        text: '#00FFFF',
        accent: '#FF00FF',
        fontSize: 26,
        style: 'neon',
        hasGrid: true,
      },
      isPremium: false,
      displayOrder: 2,
    },
    {
      id: 'gradient-sunset',
      name: 'Sunset',
      description: 'Beautiful orange to pink gradient',
      previewImageUrl: null,
      cssConfig: {
        bgGradient: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
        text: '#FFFFFF',
        accent: '#FFD700',
        fontSize: 26,
        style: 'gradient',
      },
      isPremium: true,
      displayOrder: 3,
    },
    {
      id: 'minimal-white',
      name: 'Minimal',
      description: 'Clean white background with dark text',
      previewImageUrl: null,
      cssConfig: {
        bgGradient: '#FFFFFF',
        text: '#000000',
        accent: '#333333',
        fontSize: 26,
        style: 'minimal',
      },
      isPremium: true,
      displayOrder: 4,
    },
    {
      id: 'dark-purple',
      name: 'Purple Night',
      description: 'Deep purple with luminous accents',
      previewImageUrl: null,
      cssConfig: {
        bgGradient: 'linear-gradient(135deg, #581C87 0%, #312E81 100%)',
        text: '#E9D5FF',
        accent: '#C084FC',
        fontSize: 26,
        style: 'gradient',
      },
      isPremium: true,
      displayOrder: 5,
    },
  ];

  for (const template of templates) {
    await prisma.template.create({
      data: template,
    });
    console.log(`Created template: ${template.name}`);
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
