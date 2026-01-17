# Quick Start Guide

## ✅ Setup Complete!

Your e-Verification Certificate Management System is ready to use!

### 🚀 Already Configured:
- ✅ Database connected (Neon PostgreSQL)
- ✅ Prisma schema migrated
- ✅ Admin user created
- ✅ Development server running on http://localhost:3000

### 🔑 Admin Login Credentials:
```
URL: http://localhost:3000/admin
Username: admin
Password: admin123
```

**⚠️ IMPORTANT: Change these credentials in production!**

---

## 📝 Next Steps to Complete Setup:

### 1. Setup Cloudinary (Required for Image Upload)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get your credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

4. Create Upload Preset:
   - Settings → Upload → Add upload preset
   - Name: `e-verification-users`
   - Signing Mode: **Unsigned** (IMPORTANT!)
   - Save

5. Update `.env` file with your credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name-here"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="e-verification-users"
CLOUDINARY_API_KEY="your-api-key-here"
CLOUDINARY_API_SECRET="your-api-secret-here"
```

6. Restart the dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

---

## 🧪 Test the Application:

### Test Public Features:
1. Open http://localhost:3000
2. Enter reference number: `TEST-001`
3. You should see "User not found" (expected - no users yet)

### Test Admin Panel:
1. Go to http://localhost:3000/admin
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Click "Add New User"
4. Fill in the form (sample data below)
5. Upload a photo
6. Click "Create User"

### Sample Test Data:
```
Certificate Number: 148-2026-TEST-EN
Reference Number: TEST-001
Name: John Doe
ID Number: 1234567890
Company: Test Company
Issuance Number: 1
Issued Date: 2026-01-17
Valid Until: 2027-01-17
Type: RIGGER LEVEL III- UPTO 10 TONS
Model: N/A
Trainer: Jane Smith
Location: Test Location
Photo: Upload any portrait photo
```

### Test Certificate View:
1. Go to homepage
2. Enter: `TEST-001`
3. Click "Verify Certificate"
4. You should see the certificate cards (front + back)
5. Click "Download PDF"

### Test QR Code:
1. After viewing certificate, look for QR code on back card
2. Scan with phone OR
3. Copy the certificate number from the card
4. Visit: http://localhost:3000/verify/148-2026-TEST-EN

---

## 🎯 Available Routes:

| Route | Description |
|-------|-------------|
| `/` | Public landing page - certificate search |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin dashboard - manage users |
| `/verify/[certificateNo]` | QR scan verification page |
| `/api/trpc/*` | tRPC API endpoints |
| `/api/keep-alive` | Database keep-alive endpoint |

---

## 📦 Available Commands:

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:studio       # Open Prisma Studio

# Admin
npm run create-admin    # Create admin user

# Code Quality
npm run lint            # Run ESLint
```

---

## 🔧 Troubleshooting:

### Can't upload images?
- Make sure you completed Cloudinary setup
- Verify upload preset is set to "Unsigned"
- Check `.env` file has correct credentials
- Restart dev server after updating `.env`

### Database connection error?
- Verify Neon database is active
- Check `DATABASE_URL` in `.env`
- Make sure it ends with `?sslmode=require`

### Admin login not working?
- Username: `admin` (lowercase)
- Password: `admin123`
- Check browser console for errors

### QR code not working?
- Make sure you're using the full URL
- Check NEXT_PUBLIC_APP_URL in `.env`

---

## 📚 Documentation:

- **README.md** - Complete project documentation
- **DEPLOYMENT.md** - Vercel deployment guide
- **.env.example** - Environment variables reference

---

## 🚀 Ready to Deploy?

Follow the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick deploy checklist:
1. ✅ Database setup (Neon) - DONE
2. ⏳ Cloudinary setup - REQUIRED
3. ⏳ Push to GitHub
4. ⏳ Deploy to Vercel
5. ⏳ Add env variables in Vercel
6. ⏳ Test production deployment

---

## 💡 Tips:

- Use Prisma Studio to view/edit database: `npm run db:studio`
- Check server logs for API errors
- Test locally before deploying
- Always backup your database before major changes

---

## 📞 Support:

For queries contact:
- Tel: 00966 13 99439017
- Email: abdullah.shehri@bureauveritas.com

---

**Happy Coding! 🎉**
