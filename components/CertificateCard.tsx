'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

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
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${user.certificateNo}`;
    QRCode.toDataURL(verifyUrl, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: 'H'
    })
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

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawFrontCard = async (canvas: HTMLCanvasElement, logo: HTMLImageElement, photo: HTMLImageElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const width = 1012.5;
    const height = 637.5;
    canvas.width = width;
    canvas.height = height;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Watermark - centered logo with opacity
    ctx.globalAlpha = 0.25;
    ctx.drawImage(logo, (width - 525) / 2, (height - 525) / 2, 525, 525);
    ctx.globalAlpha = 1.0;

    // Top left logo
    ctx.drawImage(logo, 37, 24, 120, 120);

    // Certificate No text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 26px Arial';
    ctx.fillText('Certificate No:', 186, 50);

    // Certificate number (blue)
    ctx.fillStyle = '#3b4a9d';
    ctx.font = 'bold 34px Arial';
    ctx.fillText(user.certificateNo, 186, 95);

    // Reference details
    ctx.fillStyle = '#000000';
    ctx.font = '18px Arial';
    ctx.fillText(`Ref.# ${user.referenceNo}`, 186, 125);
    ctx.fillText(`Issued on: ${formatDate(user.issuedDate)}`, 186, 150);
    ctx.fillText(`Valid until: ${formatDate(user.validUntil)}`, 186, 170);

    // User photo (top right)
    ctx.drawImage(photo, width - 197, 24, 160, 197);

    // Top border
    ctx.fillStyle = '#000000';
    ctx.fillRect(37, 239, width - 74, 3);

    // Name section
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Name:', 37, 275);
    ctx.fillStyle = '#3b4a9d';
    ctx.fillText(user.name.toUpperCase(), 145, 275);

    // ID No
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`ID No: ${user.idNo}`, 37, 310);

    // Company
    ctx.fillText(`Company: ${user.company}`, 37, 340);

    // Issuance No
    ctx.fillText(`Issuance No.: ${user.issuanceNo}`, 37, 370);

    // Bottom border
    ctx.fillRect(37, 387, width - 74, 3);

    // Certificate completion text (centered)
    ctx.font = 'bold 17px Arial';
    const certText = 'This certifies that the above mentioned person has successfully completed the BV Safety Course. Refer to backside for details.';
    ctx.fillText(certText, width / 2 - ctx.measureText(certText).width / 2, 420);

    // Bottom border for cert text
    ctx.fillRect(37, 430, width - 74, 3);

    // Contact info (centered)
    ctx.font = '16px Arial';
    const contact1 = 'For any queries: Tel. 00966 13 99439017';
    const contact2 = 'abdullah.shehri@bureauveritas.com';
    ctx.fillText(contact1, width / 2 - ctx.measureText(contact1).width / 2, 465);
    ctx.fillText(contact2, width / 2 - ctx.measureText(contact2).width / 2, 490);
  };

  const drawBackCard = async (canvas: HTMLCanvasElement, qrImage: HTMLImageElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const width = 1012.5;
    const height = 637.5;
    canvas.width = width;
    canvas.height = height;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // QR Code on left side
    const qrSize = 420;
    const qrX = (width / 2 - qrSize) / 2;
    const qrY = (height - qrSize) / 2;
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // Right side content
    const rightX = width / 2 + 25;
    let currentY = 120;

    // Certificate No
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('CERTIFICATE NO.:', rightX, currentY);
    currentY += 25;

    ctx.fillStyle = '#3b4a9d';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(user.certificateNo, rightX, currentY);
    currentY += 40;

    // Type
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText(`TYPE: ${user.type}`, rightX, currentY);
    currentY += 30;

    // Model (if exists)
    if (user.model) {
      ctx.fillText(`MODEL: ${user.model}`, rightX, currentY);
      currentY += 30;
    }

    // Trainer (if exists)
    if (user.trainer) {
      ctx.fillText(`TRAINER: ${user.trainer}`, rightX, currentY);
      currentY += 30;
    }

    // Location (if exists)
    if (user.location) {
      ctx.fillText(`LOCATION: ${user.location}`, rightX, currentY);
      currentY += 30;
    }

    // Disclaimer text
    currentY += 30;
    ctx.font = '14px Arial';
    const disclaimerLines = [
      'This card does not relieve the operator from responsibilities related to the safe handling,',
      'operation, or reliability of the listed equipment.Only contracted parties can hold Bureau',
      'Veritas liable for errors/omissions related to this card. Bureau Veritas is not liable for any',
      'mistakes, negligence, judgement or fault committed by the person holding this card.',
      'The SAG license is the client\'s responsibility.'
    ];

    disclaimerLines.forEach(line => {
      ctx.fillText(line, rightX, currentY);
      currentY += 20;
    });

    // Bottom red text
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px Arial';
    const bottomText1 = 'Scan QR code to verify this certificate at';
    const bottomText2 = 'https://e-certificates.bureauveritas.com';
    const bottomY = height - 20;

    const text1Width = ctx.measureText(bottomText1).width;
    const text2Width = ctx.measureText(bottomText2).width;
    const totalWidth = text1Width + 5 + text2Width;

    ctx.fillText(bottomText1, width / 2 - totalWidth / 2, bottomY);

    // Underline the URL
    const urlX = width / 2 - totalWidth / 2 + text1Width + 5;
    ctx.fillText(bottomText2, urlX, bottomY);
    ctx.fillRect(urlX, bottomY + 2, text2Width, 1);
  };

  const downloadPDF = async () => {
    setIsGenerating(true);

    try {
      console.log('Loading images...');
      const [logoImg, photoImg, qrImg] = await Promise.all([
        loadImage('/assets/logo.jpeg'),
        loadImage(user.imageUrl),
        qrCodeUrl ? loadImage(qrCodeUrl) : Promise.reject('QR code not available')
      ]);

      console.log('Creating canvases...');
      const frontCanvas = document.createElement('canvas');
      const backCanvas = document.createElement('canvas');

      console.log('Drawing front card...');
      await drawFrontCard(frontCanvas, logoImg, photoImg);

      console.log('Drawing back card...');
      await drawBackCard(backCanvas, qrImg);

      console.log('Generating PDF...');
      const cardWidth = 85.6; // mm
      const cardHeight = 53.98; // mm

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [cardWidth, cardHeight],
      });

      // Add front card
      const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(frontImgData, 'JPEG', 0, 0, cardWidth, cardHeight);

      // Add back card
      pdf.addPage([cardWidth, cardHeight], 'landscape');
      const backImgData = backCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(backImgData, 'JPEG', 0, 0, cardWidth, cardHeight);

      const fileName = `Certificate_${user.certificateNo}_${user.name.replace(/\s+/g, '_')}.pdf`;
      console.log('Saving PDF...');
      pdf.save(fileName);
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Front Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Front Side</h3>
        <div className="flex justify-center">
          <div
            ref={frontCardRef}
            data-card="front"
            className="relative bg-white"
            style={{
              width: '1012.5px',
              height: '637.5px',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* Watermark - Large centered circle logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.25] pointer-events-none">
              <Image
                src="/assets/logo.jpeg"
                alt="Watermark"
                width={525}
                height={525}
                className="object-contain"
                style={{ filter: 'grayscale(20%)' }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col" style={{ padding: '24px 37px' }}>
              {/* Top Section - Logo and Certificate Info */}
              <div className="flex justify-between items-start" style={{ marginBottom: '18px' }}>
                {/* Left - Logo and Text */}
                <div className="flex items-start" style={{ gap: '29px' }}>
                  <Image
                    src="/assets/logo.jpeg"
                    alt="Bureau Veritas"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '9px' }}>
                      Certificate No:
                    </div>
                    <div style={{
                      fontSize: '34px',
                      fontWeight: 'bold',
                      color: '#3b4a9d',
                      marginBottom: '15px'
                    }}>
                      {user.certificateNo}
                    </div>
                    <div style={{ fontSize: '18px', lineHeight: '1.4' }}>
                      <div><strong>Ref.#</strong> {user.referenceNo}</div>
                      <div><strong>Issued on:</strong> {formatDate(user.issuedDate)}</div>
                      <div><strong>Valid until:</strong> {formatDate(user.validUntil)}</div>
                    </div>
                  </div>
                </div>

                {/* Right - Photo */}
                <div style={{
                  width: '160px',
                  height: '197px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Middle Section - User Details with thick borders */}
              <div style={{
                borderTop: '3px solid #000',
                borderBottom: '3px solid #000',
                padding: '15px 0',
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '7px'
                }}>
                  Name: <span style={{ color: '#3b4a9d', textTransform: 'uppercase' }}>{user.name}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                  ID No: {user.idNo}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                  Company: {user.company}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  Issuance No.: {user.issuanceNo}
                </div>
              </div>

              {/* Bottom Section - Certificate text between lines and contact */}
              <div className="my-2">
                <div style={{
                  borderBottom: '3px solid #000',
                  padding: '2px 0',
                  marginBottom: '12px',
                  fontSize: '17px',
                  lineHeight: '1.3',
                  textAlign: 'center',
                  fontWeight: '700'
                }}>
                  This certifies that the above mentioned person has successfully completed the BV Safety Course. Refer to backside for details.
                </div>
                <div style={{ fontSize: '16px', lineHeight: '1.4', textAlign: 'center' }}>
                  For any queries: Tel. 00966 13 99439017<br />
                  abdullah.shehri@bureauveritas.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Back Side</h3>
        <div className="flex justify-center">
          <div
            ref={backCardRef}
            data-card="back"
            className="relative bg-white"
            style={{
              width: '1012.5px',
              height: '637.5px',
              fontFamily: 'Arial, sans-serif'
            }}
          >

            {/* Content */}
            <div className="relative h-full flex" style={{ padding: '45px 30px 50px 30px' }}>
              {/* Left - QR Code */}
              <div style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: '25px'
              }}>
                {qrCodeUrl && (
                  <div>
                    <Image
                      src={qrCodeUrl}
                      alt="QR Code"
                      width={420}
                      height={420}
                    />
                  </div>
                )}
              </div>

              {/* Right - Details */}
              <div style={{
                width: '50%',
                paddingLeft: '25px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                margin: '50px 0px'
              }}>
                {/* Top Details */}
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '14px', marginBottom: '3px' }}>
                      CERTIFICATE NO.:
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#3b4a9d' }}>
                      {user.certificateNo}
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '16px' }}>
                      TYPE: {user.type}
                    </div>
                  </div>

                  {user.model && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '16px' }}>
                        MODEL: {user.model}
                      </div>
                    </div>
                  )}

                  {user.trainer && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '16px' }}>
                        TRAINER: {user.trainer}
                      </div>
                    </div>
                  )}

                  {user.location && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '16px' }}>
                        LOCATION: {user.location}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Disclaimer */}
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                  marginTop: '20px',
                  marginBottom: '15px'
                }}>
                  This card does not relieve the operator from responsibilities related to the safe handling, operation, or reliability of the listed equipment.Only contracted parties can hold Bureau Veritas liable for errors/omissions related to this card. Bureau Veritas is not liable for any mistakes, negligence, judgement or fault committed by the person holding this card. The SAG license is the client&apos;s responsibility.
                </div>
              </div>
            </div>

            {/* Bottom Red Text */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '30px',
              right: '30px',
              fontSize: '16px',
              color: '#dc2626',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Scan QR code to verify this certificate at <span style={{ textDecoration: 'underline' }}>https://e-certificates.bureauveritas.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={downloadPDF}
          disabled={isGenerating || !qrCodeUrl}
          size="lg"
          className="px-12"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
