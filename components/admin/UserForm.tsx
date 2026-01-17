'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface User {
  id: string;
  certificateNo: string;
  referenceNo: string;
  name: string;
  idNo: string;
  company: string;
  issuanceNo: string;
  issuedDate: Date;
  validUntil: Date;
  type: string;
  model?: string | null;
  trainer?: string | null;
  location?: string | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    certificateNo: '',
    referenceNo: '',
    name: '',
    idNo: '',
    company: '',
    issuanceNo: '',
    issuedDate: '',
    validUntil: '',
    type: '',
    model: '',
    trainer: '',
    location: '',
    imageUrl: '',
  });

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    if (user) {
      setFormData({
        certificateNo: user.certificateNo || '',
        referenceNo: user.referenceNo || '',
        name: user.name || '',
        idNo: user.idNo || '',
        company: user.company || '',
        issuanceNo: user.issuanceNo || '',
        issuedDate: user.issuedDate ? new Date(user.issuedDate).toISOString().split('T')[0] : '',
        validUntil: user.validUntil ? new Date(user.validUntil).toISOString().split('T')[0] : '',
        type: user.type || '',
        model: user.model || '',
        trainer: user.trainer || '',
        location: user.location || '',
        imageUrl: user.imageUrl || '',
      });
    }
  }, [user]);

  const createMutation = trpc.user.create.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
      onSuccess();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.imageUrl) {
      setError('Please upload a photo');
      return;
    }

    if (user) {
      updateMutation.mutate({ id: user.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Get signature from our API
      const signatureResponse = await fetch('/api/cloudinary-signature', {
        method: 'POST',
      });
      const signatureData = await signatureResponse.json();

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apikey);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('signature', signatureData.signature);
      formData.append('folder', signatureData.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudname}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (uploadData.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: uploadData.secure_url }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="certificateNo">Certificate Number *</Label>
                <Input
                  id="certificateNo"
                  name="certificateNo"
                  value={formData.certificateNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 148-2026-3212931-EN"
                />
              </div>

              <div>
                <Label htmlFor="referenceNo">Reference Number *</Label>
                <Input
                  id="referenceNo"
                  name="referenceNo"
                  value={formData.referenceNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g., PRIVATE-21642"
                />
              </div>

              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ATTA ULLAH KHAN GHULAM BASHIR"
                />
              </div>

              <div>
                <Label htmlFor="idNo">ID Number *</Label>
                <Input
                  id="idNo"
                  name="idNo"
                  value={formData.idNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2626862110"
                />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Private"
                />
              </div>

              <div>
                <Label htmlFor="issuanceNo">Issuance Number *</Label>
                <Input
                  id="issuanceNo"
                  name="issuanceNo"
                  value={formData.issuanceNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="issuedDate">Issued Date *</Label>
                <Input
                  id="issuedDate"
                  name="issuedDate"
                  type="date"
                  value={formData.issuedDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  placeholder="e.g., RIGGER LEVEL III- UPTO 10 TONS"
                />
              </div>

              <div>
                <Label htmlFor="model">Model (Optional)</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., N/A"
                />
              </div>

              <div>
                <Label htmlFor="trainer">Trainer (Optional)</Label>
                <Input
                  id="trainer"
                  name="trainer"
                  value={formData.trainer}
                  onChange={handleChange}
                  placeholder="e.g., NAVEED UMAR"
                />
              </div>

              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., AL KHOBAR"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t pt-6">
            <Label className="mb-2 block">User Photo *</Label>
            <div className="flex items-start gap-4">
              {formData.imageUrl && (
                <div className="w-32 h-40 relative border-2 border-gray-300 rounded">
                  <Image
                    src={formData.imageUrl}
                    alt="User photo"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="max-w-xs"
                />
                {uploading && (
                  <p className="text-sm text-gray-600">Uploading...</p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : user
                ? 'Update User'
                : 'Create User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
