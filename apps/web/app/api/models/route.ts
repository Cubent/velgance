import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@repo/database/generated/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let models;
    
    if (search) {
      models = await prisma.model.findMany({
        where: {
          isActive: true,
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            {
              AND: [
                { firstName: { contains: search.split(' ')[0] || '', mode: 'insensitive' } },
                { lastName: { contains: search.split(' ')[1] || '', mode: 'insensitive' } }
              ]
            }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      models = await prisma.model.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, igProfileLink, image } = body;

    const model = await prisma.model.create({
      data: {
        firstName,
        lastName,
        email,
        igProfileLink: igProfileLink || null,
        image,
        isActive: true
      }
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}
