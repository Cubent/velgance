import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@repo/database/generated/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const gender = searchParams.get('gender');

    let whereClause: any = { isActive: true };
    
    // Add gender filter if provided
    if (gender && (gender === 'male' || gender === 'female')) {
      whereClause.gender = gender;
    }
    
    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        {
          AND: [
            { firstName: { contains: search.split(' ')[0] || '', mode: 'insensitive' } },
            { lastName: { contains: search.split(' ')[1] || '', mode: 'insensitive' } }
          ]
        }
      ];
    }

    const models = await prisma.model.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, igProfileLink, image, height, weight, location } = body;

    if (!firstName || !lastName || !email || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const model = await prisma.model.create({
      data: {
        firstName,
        lastName,
        email,
        igProfileLink: igProfileLink || null,
        image,
        height: height || null,
        weight: weight || null,
        location: location || null,
        isActive: true
      }
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}

