import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@repo/database/generated/client';
import { sendModelApplicationAdminEmail } from '../../../../services/model-application-email';
import { uploadMultipleImagesToCloudinary } from '../../../../services/cloudinary';

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
    
    // Get multiple portfolio files
    const portfolioFiles: File[] = [];
    let index = 0;
    while (true) {
      const file = formData.get(`portfolio_${index}`) as File;
      if (!file) break;
      portfolioFiles.push(file);
      index++;
    }

    if (!firstName || !lastName || !email || !location || !height) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload multiple images to Cloudinary
    let portfolioUrls: string[] = [];
    
    if (portfolioFiles.length > 0) {
      try {
        console.log(`Uploading ${portfolioFiles.length} images to Cloudinary...`);
        const uploadResults = await uploadMultipleImagesToCloudinary(
          portfolioFiles,
          `velgance/portfolios/${firstName.toLowerCase()}-${lastName.toLowerCase()}`
        );
        
        portfolioUrls = uploadResults.map(result => result.secure_url);
        console.log(`Successfully uploaded ${portfolioUrls.length} images to Cloudinary`);
      } catch (uploadError) {
        console.error('Error uploading images to Cloudinary:', uploadError);
        return NextResponse.json({ error: 'Failed to upload portfolio images' }, { status: 500 });
      }
    }

    // Create database entry (file upload already handled above)
    const application = await prisma.model.create({
      data: {
        firstName,
        lastName,
        email,
        igProfileLink: instagram || null,
        image: portfolioUrls.length > 0 ? portfolioUrls[0] : 'https://via.placeholder.com/400x600?text=No+Image',
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
      portfolioUrls: portfolioUrls,
      portfolioFiles: portfolioFiles,
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
