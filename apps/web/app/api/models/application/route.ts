import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@repo/database/generated/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const height = formData.get('height') as string;
    const weight = formData.get('weight') as string;
    const instagram = formData.get('instagram') as string;
    const experience = formData.get('experience') as string;
    const availability = formData.get('availability') as string;
    const additionalInfo = formData.get('additionalInfo') as string;
    const portfolio = formData.get('portfolio') as File;

    if (!firstName || !lastName || !email || !location || !height) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate slug from firstName and lastName
    const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
      .replace(/[^a-z0-9\-]/g, '-')
      .replace(/\-+/g, '-')
      .replace(/^\-|\-$/g, '');

    // Handle file upload (you might want to upload to a cloud storage service)
    let portfolioUrl = '';
    if (portfolio && portfolio.size > 0) {
      // For now, we'll store the filename. In production, upload to cloud storage
      portfolioUrl = `uploads/${Date.now()}-${portfolio.name}`;
    }

    // Create model application (you might want to create a separate table for applications)
    const application = await prisma.model.create({
      data: {
        firstName,
        lastName,
        slug,
        email,
        igProfileLink: instagram || null,
        image: portfolioUrl || 'https://via.placeholder.com/400x600?text=No+Image',
        height: height || null,
        weight: weight || null,
        location: location || null,
        isActive: false, // Applications start as inactive until approved
      }
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to applicant

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application.id 
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
