# e-Verification Certificate Management System

A production-ready web application for managing and verifying certificates. Built with Next.js, tRPC, Prisma, and PostgreSQL.

## Features

### Public Features
- **Certificate Verification**: Users can verify certificates by entering reference numbers
- **Card Preview**: View front and back of certificate cards with watermarks
- **PDF Download**: Download certificate cards as PDF with watermark
- **QR Code Verification**: Scan QR codes on certificates to verify authenticity

### Admin Features
- **Secure Login**: Admin authentication system
- **User Management**: Create, edit, and delete user certificates
- **Image Upload**: Upload user photos to Cloudinary
- **Dashboard**: Manage all certificates in one place

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Shadcn UI, Tailwind CSS
- **Backend**: tRPC APIs
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Image Upload**: Cloudinary
- **PDF Generation**: jsPDF, html2canvas
- **QR Codes**: qrcode library

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup (Neon)

1. Go to [Neon Console](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `.env` file with your Neon DATABASE_URL

### 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret from dashboard
4. Create an upload preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Copy the preset name
5. Update `.env` file with Cloudinary credentials

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `NEXT_PUBLIC_APP_URL`: Your app URL (for QR codes)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

### 5. Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 6. Create Admin User

After starting the dev server, create an admin user using the tRPC endpoint or Prisma Studio.

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard:
   - All variables from `.env.example`
4. Deploy

### 3. Setup Vercel Cron Job (Keep DB Alive)

Create `vercel.json` in project root:

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

This will ping your database every 10 minutes to prevent Neon from going to sleep.

## Database Keep-Alive

The `/api/keep-alive` endpoint ensures your Neon database doesn't go to sleep after inactivity. Vercel Cron will ping this endpoint every 10 minutes.

## Project Structure

```
e-verification-app/
├── app/
│   ├── admin/              # Admin pages
│   ├── verify/             # QR verification page
│   ├── api/                # API routes
│   └── page.tsx            # Landing page
├── components/
│   ├── admin/              # Admin components
│   ├── ui/                 # Shadcn UI components
│   └── CertificateCard.tsx # Certificate preview
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── trpc/               # tRPC setup
├── prisma/
│   └── schema.prisma       # Database schema
├── server/
│   ├── routers/            # tRPC routers
│   └── trpc.ts             # tRPC initialization
└── public/
    └── assets/             # Static assets (logo)
```

## Usage

### Public Users

1. Visit the homepage
2. Enter your reference number (e.g., `PRIVATE-21642`)
3. View your certificate cards
4. Download PDF

### QR Code Scanning

1. Scan the QR code on a certificate
2. View complete user details
3. Verify authenticity

### Admin

1. Visit `/admin`
2. Login with credentials
3. Add/Edit/Delete users
4. Upload user photos
5. Manage all certificates

## Production Checklist

- [ ] Update admin credentials
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure Cloudinary upload preset
- [ ] Setup Neon database
- [ ] Add environment variables in Vercel
- [ ] Setup Vercel Cron for keep-alive
- [ ] Test QR code scanning
- [ ] Test PDF generation
- [ ] Test image upload

## Support

For queries contact:
- Tel: 00966 13 99439017
- Email: abdullah.shehri@bureauveritas.com
