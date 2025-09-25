import React from 'react';
import type { Metadata } from 'next';
import ModelPageClient from './client';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/models/${id}`);
    if (response.ok) {
      const model = await response.json();
      return {
        title: `${model.firstName} ${model.lastName} - Velgance Agency`,
        description: `Modello professionale ${model.firstName} ${model.lastName} presso Velgance Agency. ${model.location ? `Basato a ${model.location}.` : ''} Contatta per booking e collaborazioni.`,
        openGraph: {
          title: `${model.firstName} ${model.lastName} - Velgance Agency`,
          description: `Modello professionale ${model.firstName} ${model.lastName} presso Velgance Agency.`,
          images: [
            {
              url: model.image,
              width: 800,
              height: 600,
              alt: `${model.firstName} ${model.lastName}`,
            },
          ],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Modello - Velgance Agency',
    description: 'Modello professionale presso Velgance Agency',
  };
}

export default function ModelPage({ params }: Props) {
  return <ModelPageClient params={params} />;
}
