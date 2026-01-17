'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
}

interface CertificateCardProps {
  user: User;
}

export default function CertificateCard({ user }: CertificateCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code for certificate verification
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${user.certificateNo}`;
    QRCode.toDataURL(verifyUrl, { width: 200, margin: 1 })
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [user.certificateNo]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const downloadPDF = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;

    setIsGenerating(true);

    try {
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98], // Standard credit card size
      });

      // Capture front card
      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
      });

      // Add front card to PDF
      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', 0, 0, 85.6, 53.98);

      // Add new page for back
      pdf.addPage();

      // Capture back card
      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
      });

      // Add back card to PDF
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', 0, 0, 85.6, 53.98);

      // Download PDF
      pdf.save(`${user.name}_Certificate_${user.certificateNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Front Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Front Side</h3>
        <div
          ref={frontCardRef}
          className="relative w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl"
          style={{ aspectRatio: '85.6/53.98' }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Image
              src="/assets/logo.jpeg"
              alt="Watermark"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <Image
                  src="/assets/logo.jpeg"
                  alt="e-Verification"
                  width={80}
                  height={80}
                  className="object-contain"
                />
                <div className="text-left">
                  <div className="text-sm font-bold mb-1">Certificate No:</div>
                  <div className="text-blue-700 font-bold text-lg mb-2">{user.certificateNo}</div>
                  <div className="text-xs">
                    <div><span className="font-semibold">Ref.#</span> {user.referenceNo}</div>
                    <div><span className="font-semibold">Issued on</span> {formatDate(user.issuedDate)}</div>
                    <div><span className="font-semibold">Valid until</span> {formatDate(user.validUntil)}</div>
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="w-24 h-28 relative border-2 border-gray-300">
                <Image
                  src={user.imageUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* User Details */}
            <div className="border-t-2 border-b-2 border-black py-2 mb-2">
              <div className="text-xl font-bold text-blue-700 mb-1">Name: {user.name}</div>
              <div className="text-lg font-bold">ID No: {user.idNo}</div>
              <div className="text-lg font-bold">Company: {user.company}</div>
              <div className="text-lg font-bold">Issuance No.: {user.issuanceNo}</div>
            </div>

            {/* Footer */}
            <div className="mt-auto">
              <div className="text-sm border-t border-black pt-2">
                This certifies that the above mentioned person has successfully completed the Safety Course. Refer to backside for details.
              </div>
              <div className="text-xs mt-2">
                For any queries: Tel. 00966 13 99439017<br />
                abdullah.shehri@bureauveritas.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Back Side</h3>
        <div
          ref={backCardRef}
          className="relative w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl"
          style={{ aspectRatio: '85.6/53.98' }}
        >
          {/* Content */}
          <div className="relative z-10 h-full flex">
            {/* Left side - QR Code */}
            <div className="w-1/2 flex flex-col items-center justify-center pr-4 border-r border-gray-300">
              {qrCodeUrl && (
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={180}
                  height={180}
                  className="mb-4"
                />
              )}
              <div className="text-xs text-red-600 font-semibold text-center mt-2">
                Scan QR code to verify this certificate
              </div>
            </div>

            {/* Right side - Details */}
            <div className="w-1/2 pl-4 flex flex-col justify-between text-sm">
              <div>
                <div className="mb-2">
                  <div className="font-semibold">CERTIFICATE NO.:</div>
                  <div className="text-blue-700 font-bold">{user.certificateNo}</div>
                </div>
                <div className="mb-2">
                  <div className="font-semibold">TYPE: {user.type}</div>
                </div>
                {user.model && (
                  <div className="mb-2">
                    <div className="font-semibold">MODEL: {user.model}</div>
                  </div>
                )}
                {user.trainer && (
                  <div className="mb-2">
                    <div className="font-semibold">TRAINER: {user.trainer}</div>
                  </div>
                )}
                {user.location && (
                  <div className="mb-2">
                    <div className="font-semibold">LOCATION: {user.location}</div>
                  </div>
                )}
              </div>

              <div className="text-xs leading-tight mt-4">
                This card does not relieve the operator from responsibilities related to the safe handling, operation, or reliability of the listed equipment. Only contracted parties can hold e-Verification liable for errors/omissions related to this card. e-Verification is not liable for any mistakes, negligence, judgement or fault committed by the person holding this card. The SAG license is the client&apos;s responsibility.
              </div>

              <div className="text-xs mt-2 pt-2 border-t border-gray-300">
                {user.certificateNo}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          onClick={downloadPDF}
          disabled={isGenerating}
          size="lg"
          className="px-12"
        >
          {isGenerating ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>
    </div>
  );
}
