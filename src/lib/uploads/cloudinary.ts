import { createHash } from 'crypto';

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

function parseCloudinaryUrl(url: string): CloudinaryConfig | null {
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return null;
  return { apiKey: match[1], apiSecret: match[2], cloudName: match[3] };
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const url = process.env.CLOUDINARY_URL;
  if (!url) return null;
  return parseCloudinaryUrl(url);
}

export async function uploadImageToCloudinary(file: File, folder = 'factify/team') {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error('CLOUDINARY_URL is not configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash('sha1')
    .update(`${paramsToSign}${config.apiSecret}`)
    .digest('hex');

  const body = new FormData();
  body.append('file', file);
  body.append('api_key', config.apiKey);
  body.append('timestamp', String(timestamp));
  body.append('signature', signature);
  body.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Cloudinary upload failed');
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
