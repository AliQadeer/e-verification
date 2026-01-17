'use client';

import { useState } from 'react';
import Image from 'next/image';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import CertificateCard from '@/components/CertificateCard';
import Link from 'next/link';

export default function Home() {
  const [referenceNo, setReferenceNo] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: user, isLoading, error } = trpc.user.getByReference.useQuery(
    { referenceNo },
    { enabled: searchTriggered && referenceNo.length > 0 }
  );

  const handleSearch = () => {
    if (referenceNo.trim()) {
      setSearchTriggered(true);
    }
  };

  const handleReset = () => {
    setReferenceNo('');
    setSearchTriggered(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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
          <Link href="/admin">
            <Button variant="outline">Admin Login</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!searchTriggered || !user ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Verify Your Certificate
                  </h2>
                  <p className="text-gray-600">
                    Enter your reference number to view and download your certificate
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter Reference Number (e.g., PRIVATE-21642)"
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="text-lg py-6"
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="w-full text-lg py-6"
                    disabled={!referenceNo.trim() || isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Verify Certificate'}
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-center">
                      {error.message || 'User data not found. Please check your reference number.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>For any queries:</p>
              <p>Tel. 00966 13 99439017</p>
              <p>abdullah.shehri@bureauveritas.com</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Your Certificate</h2>
              <Button onClick={handleReset} variant="outline">
                Search Another
              </Button>
            </div>

            <CertificateCard user={user} />
          </div>
        )}
      </main>
    </div>
  );
}
