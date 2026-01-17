# Deployment Guide - e-Verification Certificate Management

## Quick Start Checklist

Follow these steps to deploy your application:

### 1. Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project: "bureau-veritas"
4. Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)
5. Save this for environment variables

### 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard
4. Note down:
   - Cloud Name
   - API Key
   - API Secret

#### Create Upload Preset

1. Go to Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure:
   - Preset name: `e_verification_users` (or any name you want)
   - Signing Mode: **Unsigned** (IMPORTANT!)
   - Folder: `e-verification/users` (optional)
5. Save
6. Copy the preset name

### 3. Environment Variables Setup

Create `.env.local` file (or update `.env`):

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://YOUR_NEON_CONNECTION_STRING"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App URL (for QR codes)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Migration

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Create Admin User

```bash
# Run the admin creation script
npm run create-admin
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change these immediately after first login!**

### 6. Test Locally

```bash
# Start development server
npm run dev
```

Visit:
- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin`

### 7. Deploy to Vercel

#### Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - e-Verification Certificate Management"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/e-verification-app.git

# Push
git branch -M main
git push -u origin main
```

#### Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Add Environment Variables in Vercel

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL = your-neon-connection-string
NEXTAUTH_SECRET = your-generated-secret
NEXTAUTH_URL = https://your-app.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = your-upload-preset
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

**IMPORTANT:** Set these for "Production", "Preview", and "Development" environments.

6. Click "Deploy"

### 8. Setup Cron Job (Keep Database Alive)

The `vercel.json` file is already configured to ping your database every 10 minutes.

To verify it's working:
1. After deployment, go to your Vercel project
2. Go to "Cron Jobs" tab
3. You should see the `/api/keep-alive` cron job listed
4. It will run every 10 minutes automatically

### 9. Post-Deployment Steps

1. **Test the deployed app:**
   - Visit your Vercel URL
   - Test certificate verification
   - Login to admin panel
   - Create a test user
   - Upload a photo
   - Generate and download PDF
   - Test QR code scanning

2. **Change admin password:**
   - Login to admin panel
   - Create a new admin with strong password
   - Delete the default admin

3. **Update environment variables:**
   - Generate strong NEXTAUTH_SECRET
   - Update NEXTAUTH_URL to your Vercel URL
   - Update NEXT_PUBLIC_APP_URL to your Vercel URL

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Check DATABASE_URL is correct
2. Ensure it ends with `?sslmode=require`
3. Verify Neon database is active (not deleted)

### Cloudinary Upload Not Working

1. Verify upload preset is set to "Unsigned"
2. Check Cloud Name is correct
3. Ensure NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET matches your preset name

### Admin Login Not Working

1. Verify you ran `npm run create-admin`
2. Check database has Admin table
3. Try creating admin through Prisma Studio: `npm run db:studio`

### QR Code Not Working

1. Verify NEXT_PUBLIC_APP_URL is set correctly
2. Check that it points to your deployed URL
3. Ensure certificate number is correct

### PDF Generation Issues

1. Clear browser cache
2. Check if images are loading (CORS issues)
3. Verify logo is in `public/assets/logo.jpeg`

## Maintenance

### Adding New Admin Users

Use Prisma Studio:
```bash
npm run db:studio
```

Or create via the tRPC endpoint.

### Backing Up Database

1. Go to Neon Console
2. Select your project
3. Go to Backups tab
4. Create manual backup or setup automatic backups

### Monitoring

- **Vercel Analytics:** Check deployment logs and performance
- **Neon Dashboard:** Monitor database usage and queries
- **Cloudinary Dashboard:** Track image uploads and storage

## Security Checklist

- [ ] Changed default admin credentials
- [ ] Set strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enabled HTTPS (automatic with Vercel)
- [ ] Database connection uses SSL
- [ ] Cloudinary upload preset configured properly
- [ ] Environment variables set in Vercel (not in code)
- [ ] `.env` files in `.gitignore`

## Support

For technical support:
- Tel: 00966 13 99439017
- Email: abdullah.shehri@bureauveritas.com

## Next Steps

After successful deployment:
1. Share the URL with your client
2. Create user accounts for testing
3. Generate sample certificates
4. Test QR code scanning workflow
5. Train admin users on the dashboard
