'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  label = 'Profile photo',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Upload failed');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-factify-gray bg-factify-gray/20">
          {value ? (
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-factify-gray-dark px-2 text-center">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <Label htmlFor="image-url" className="text-xs text-factify-gray-dark">
              Image URL
            </Label>
            <div className="relative mt-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-factify-gray-dark/50" />
              <Input
                id="image-url"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload image
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-xs text-factify-error">{error}</p>}
          <p className="text-xs text-factify-gray-dark">
            Paste a URL or upload via Cloudinary. Recommended: square image, at least 400x400px.
          </p>
        </div>
      </div>
    </div>
  );
}
