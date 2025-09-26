import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@repo/database/generated/client';
import { sendModelApplicationAdminEmail } from '../../../../services/model-application-email';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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
    const gender = formData.get('gender') as string;
    const instagram = formData.get('instagram') as string;
    const experience = formData.get('experience') as string;
    const availability = formData.get('availability') as string;
    const additionalInfo = formData.get('additionalInfo') as string;
    const portfolio = formData.get('portfolio') as File;

    if (!firstName || !lastName || !email || !location || !height) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle file upload to website public folder
    let portfolioUrl = '';
    let portfolioFile: File | null = null;
    if (portfolio && portfolio.size > 0) {
      try {
        // Create filename with timestamp
        const timestamp = Date.now();
        const fileExtension = portfolio.name.split('.').pop();
        const fileName = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${timestamp}.${fileExtension}`;
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'portfolios');
        await mkdir(uploadsDir, { recursive: true });
        
        // Convert file to buffer and save
        const bytes = await portfolio.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadsDir, fileName);
        await writeFile(filePath, buffer);
        
        // Create public URL
        portfolioUrl = `/uploads/portfolios/${fileName}`;
        portfolioFile = portfolio;
        
        console.log(`File uploaded successfully: ${portfolioUrl}`);
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        // Continue without file if upload fails
      }
    }

    // Create model application (you might want to create a separate table for applications)
    const application = await prisma.model.create({
      data: {
        firstName,
        lastName,
        email,
        igProfileLink: instagram || null,
        image: portfolioUrl || 'https://via.placeholder.com/400x600?text=No+Image',
        height: height || null,
        weight: weight || null,
        location: location || null,
        gender: gender || 'female',
        isActive: false, // Applications start as inactive until approved
      }
    });

    // Send email notifications
    const emailData = {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      location,
      height,
      weight: weight || undefined,
      gender,
      instagram: instagram || undefined,
      experience: experience || undefined,
      availability: availability || undefined,
      additionalInfo: additionalInfo || undefined,
      portfolioUrl: portfolioUrl || undefined,
      portfolioFile: portfolioFile,
    };

    // Send notification to admin only
    await sendModelApplicationAdminEmail(emailData);

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
