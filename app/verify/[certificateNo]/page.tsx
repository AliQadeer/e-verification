'use client';

import { use } from 'react';
import Image from 'next/image';

import { trpc } from '@/lib/trpc/client';

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
    <div className="min-h-screen relative">
      {/* Background - both mobile and desktop */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/assets/background_industry.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 md:bg-black/30"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[#0033A0] text-white py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/fingerprint.png"
              alt="Fingerprint"
              width={60}
              height={60}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Authenticate your document</h1>
              <p className="text-xs md:text-sm mt-1 opacity-90">
                Thank you for submitting your document for verification.
                <br className="hidden md:block" /> Please find below the answer to your request.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12 pb-8 md:pb-12">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center mx-2 md:mx-0">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0033A0]"></div>
            <p className="mt-4 text-gray-600">Verifying certificate...</p>
          </div>
        ) : error || !user ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mx-2 md:mx-0">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
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
            <p className="text-red-700">
              User data does not exist in our records. Please verify the certificate number.
            </p>
          </div>
        ) : (
          <>
            {/* Status Icon */}
            <div className="flex justify-center mb-6 mx-2 md:mx-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#9ACD32] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden mx-2 md:mx-0">
              <div className="p-6 md:p-8 space-y-3">
                {/* Deliverable Id */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">Deliverable Id :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0">{user.certificateNo}</div>
                </div>

                {/* Published on */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">Published on :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0">{formatDate(user.issuedDate)}</div>
                </div>

                {/* QR Code Status */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">QR Code Status :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 text-green-600 font-semibold">VALIDATED</div>
                </div>

                {/* NAME */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">NAME :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 uppercase">{user.name}</div>
                </div>

                {/* ID */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">ID :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0">{user.idNo}</div>
                </div>

                {/* ISSUED ON */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">ISSUED ON :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0">{formatDate(user.issuedDate)}</div>
                </div>

                {/* VALID UNTIL */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">VALID UNTIL :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0">{formatDate(user.validUntil)}</div>
                </div>

                {/* TYPE */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">TYPE :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 uppercase">{user.type}</div>
                </div>

                {/* MODEL */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">MODEL :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 uppercase">{user.model || 'N/A'}</div>
                </div>

                {/* COMPANY */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">COMPANY :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 uppercase">{user.company}</div>
                </div>

                {/* TRAINING LOCATION */}
                <div className="flex flex-col md:flex-row md:items-center border-b border-gray-200 pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">TRAINING LOCATION :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 uppercase">{user.location || 'N/A'}</div>
                </div>

                {/* TRAINER */}
                <div className="flex flex-col md:flex-row md:items-center pb-3">
                  <div className="font-bold text-sm md:text-base w-full md:w-48">TRAINER :</div>
                  <div className="text-sm md:text-base mt-1 md:mt-0 uppercase">{user.trainer || 'N/A'}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-700 text-center">
                  For any further information on this document, please contact the issuer of the document.
                </p>
              </div>
            </div>

            {/* Visit Bureau Veritas */}
            <div className="mt-6 text-center mx-2 md:mx-0">
              <a
                href="https://www.bureauveritas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white md:text-gray-600 hover:underline"
              >
                Visit <span className="font-semibold">Bureau Veritas Website</span>
              </a>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
