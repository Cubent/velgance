import React from 'react';
import type { Metadata } from 'next';
import { database as db } from '@repo/database';
import ModelPageClient from './client';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // Direct database call to find model by ID
    const model = await db.model.findUnique({
      where: { 
        id: id,
        isActive: true
      },
      select: {
        firstName: true,
        lastName: true,
        image: true,
        location: true,
        isActive: true,
      },
    });

    if (model && model.isActive) {
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
