import { Template } from '@/types';

export const defaultTemplates: Omit<Template, 'createdAt'>[] = [
  {
    id: 'gradient-sunset',
    name: 'Gradient Sunset',
    description: 'Orange to pink gradient with white text',
    previewImageUrl: null,
    cssConfig: {
      background: 'linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)',
      textColor: '#FFFFFF',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '64px',
      fontWeight: '700',
    },
    isPremium: false,
    displayOrder: 1,
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    description: 'Clean white background with black text',
    previewImageUrl: null,
    cssConfig: {
      background: '#FFFFFF',
      textColor: '#2D3436',
      fontFamily: 'Inter, sans-serif',
      fontSize: '60px',
      fontWeight: '600',
    },
    isPremium: false,
    displayOrder: 2,
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    description: 'Dark background with neon accents',
    previewImageUrl: null,
    cssConfig: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      textColor: '#00ff88',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '64px',
      fontWeight: '700',
    },
    isPremium: false,
    displayOrder: 3,
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    description: 'Soft lavender and mint colors',
    previewImageUrl: null,
    cssConfig: {
      background: 'linear-gradient(135deg, #E0BBE4 0%, #D4F1F4 100%)',
      textColor: '#2D3436',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '60px',
      fontWeight: '600',
    },
    isPremium: false,
    displayOrder: 4,
  },
  {
    id: 'bold-red',
    name: 'Bold Red',
    description: 'Solid red background with white text',
    previewImageUrl: null,
    cssConfig: {
      background: '#D63031',
      textColor: '#FFFFFF',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '64px',
      fontWeight: '700',
    },
    isPremium: false,
    displayOrder: 5,
  },
];

export function getTemplateById(id: string): Omit<Template, 'createdAt'> | undefined {
  return defaultTemplates.find((template) => template.id === id);
}

export function getAllTemplates(): Omit<Template, 'createdAt'>[] {
  return defaultTemplates;
}
