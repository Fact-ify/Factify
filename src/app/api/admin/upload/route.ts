import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { uploadImageToCloudinary } from '@/lib/uploads/cloudinary';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be smaller than 5MB' }, { status: 400 });
    }

    const url = await uploadImageToCloudinary(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    if (message.includes('CLOUDINARY_URL')) {
      return NextResponse.json(
        {
          error:
            'Image upload is not configured. Set CLOUDINARY_URL in your environment or paste an image URL instead.',
        },
        { status: 503 }
      );
    }
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
