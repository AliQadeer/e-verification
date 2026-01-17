'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyPage({ params }: { params: Promise<{ certificateNo: string }> }) {
  const resolvedParams = use(params);
  const { data: user, isLoading, error } = trpc.user.getByCertificate.useQuery({
    certificateNo: resolvedParams.certificateNo,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.jpeg"
              alt="e-Verification"
              width={80}
              height={80}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">e-Verification</h1>
              <p className="text-sm text-gray-600">Certificate Verification</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Verifying certificate...</p>
          </div>
        ) : error || !user ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-2">
                  Certificate Not Found
                </h2>
                <p className="text-red-700 mb-6">
                  User data does not exist in our records. Please verify the certificate number.
                </p>
                <Link href="/">
                  <Button>Go to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-white">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-green-900">Certificate Verified</CardTitle>
                  <p className="text-sm text-green-700 mt-1">
                    This certificate is valid and authorized
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Photo */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-48 h-56 relative border-4 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Certificate Number</h3>
                    <p className="text-lg font-bold text-blue-700">{user.certificateNo}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Reference Number</h3>
                    <p className="text-lg font-bold text-gray-900">{user.referenceNo}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Name</h3>
                    <p className="text-lg font-bold text-gray-900">{user.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">ID Number</h3>
                    <p className="text-lg text-gray-900">{user.idNo}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Company</h3>
                    <p className="text-lg text-gray-900">{user.company}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Issued Date</h3>
                      <p className="text-gray-900">{formatDate(user.issuedDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Valid Until</h3>
                      <p className="text-gray-900">{formatDate(user.validUntil)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Type</h3>
                    <p className="text-gray-900">{user.type}</p>
                  </div>

                  {user.model && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Model</h3>
                      <p className="text-gray-900">{user.model}</p>
                    </div>
                  )}

                  {user.trainer && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Trainer</h3>
                      <p className="text-gray-900">{user.trainer}</p>
                    </div>
                  )}

                  {user.location && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">Location</h3>
                      <p className="text-gray-900">{user.location}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  This certificate has been verified and is valid. For any queries, please contact:<br />
                  Tel. 00966 13 99439017 | abdullah.shehri@bureauveritas.com
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link href="/">
                  <Button>Verify Another Certificate</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
