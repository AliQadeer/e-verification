import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = {
      timestamp,
      folder: 'e-verification/users',
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudname: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apikey: process.env.CLOUDINARY_API_KEY,
      folder: 'e-verification/users',
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
