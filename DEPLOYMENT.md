# Deployment Guide

This guide covers the complete deployment process for the Pet Adoption Platform.

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Account**
   - Code repository hosted on GitHub
   - Repository is public or private with Vercel access

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Free tier includes deployment and preview environments

3. **Supabase Project**
   - Project created at [supabase.com](https://supabase.com)
   - Database tables created and migrated
   - API keys obtained

4. **Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Step 1: Prepare Your Local Environment

### 1.1 Set Up Local Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 1.2 Test Locally

```bash
npm install
npm run build
npm run dev
```

Verify the application builds without errors and runs correctly locally.

### 1.3 Commit Changes

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

## Step 2: Set Up Supabase

### 2.1 Create Database Tables

Run migrations to create all necessary tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  user_type VARCHAR DEFAULT 'user',
  first_name VARCHAR,
  last_name VARCHAR,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  breed VARCHAR,
  type VARCHAR NOT NULL,
  age INTEGER,
  gender VARCHAR,
  size VARCHAR,
  image_url VARCHAR,
  description TEXT,
  location VARCHAR,
  vaccinated BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Adoption requests table
CREATE TABLE adoption_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pet_id UUID REFERENCES pets(id),
  status VARCHAR DEFAULT 'pending',
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  address VARCHAR,
  city VARCHAR,
  state VARCHAR,
  zip VARCHAR,
  housing VARCHAR,
  has_yard BOOLEAN,
  other_pets VARCHAR,
  other_pets_details TEXT,
  hours_alone INTEGER,
  experience VARCHAR,
  reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id),
  user_id UUID REFERENCES users(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
```

### 2.2 Set Up Row Level Security (RLS)

Create policies for data access control:

```sql
-- Users can view their own data
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Anyone can view available pets
CREATE POLICY "Pets are publicly viewable"
  ON pets FOR SELECT
  USING (available = true);

-- Users can view their adoption requests
CREATE POLICY "Users can view their adoption requests"
  ON adoption_requests FOR SELECT
  USING (user_id = auth.uid());

-- Admins can view all adoption requests
CREATE POLICY "Admins can view all adoption requests"
  ON adoption_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
```

### 2.3 Get API Keys

In Supabase dashboard:
1. Go to Settings → API
2. Copy the Project URL
3. Copy the Anon Key (public)
4. Copy the Service Role Key (keep private)

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Authorize GitHub and select your repository
5. Click "Import"

### 3.2 Configure Environment Variables

In Vercel project settings:

1. Go to Settings → Environment Variables
2. Add the following variables:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environments: All

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-anon-key
Environments: All
```

### 3.3 Configure Build Settings

Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Wait for deployment to complete (2-5 minutes)
4. Your site will be live at `https://your-project.vercel.app`

## Step 4: Post-Deployment Verification

### 4.1 Test Critical Features

```bash
# Test homepage loads
curl https://your-project.vercel.app/

# Test API endpoint
curl https://your-project.vercel.app/api/pets

# Test database connection
# (Visit /pets page and verify pets load)
```

### 4.2 Check Environment Variables

Verify environment variables are set correctly:
1. Go to Vercel project settings
2. Verify Environment Variables section shows all variables
3. No values should be undefined

### 4.3 Test Authentication

1. Navigate to `/auth/signup`
2. Create a test account
3. Login with test credentials
4. Verify dashboard loads

### 4.4 Test Adoption Features

1. Browse pets at `/pets`
2. Click on a pet
3. Submit an adoption application
4. Verify request appears in user dashboard

### 4.5 Monitor Logs

1. Go to Vercel project
2. Click "Deployments"
3. View "Logs" for any errors
4. Check for database connection issues

## Step 5: Custom Domain Setup

### 5.1 Add Domain to Vercel

1. Go to Vercel project Settings
2. Click "Domains"
3. Enter your domain name
4. Click "Add"

### 5.2 Configure DNS

Follow Vercel's DNS setup instructions:
- Add `A` record pointing to Vercel IP
- Or add `CNAME` record if using subdomain
- Wait for DNS propagation (up to 24 hours)

### 5.3 Enable SSL Certificate

- Vercel automatically provisions free SSL certificate
- Verify HTTPS works after DNS propagation
- Certificate auto-renews

## Step 6: Continuous Deployment

### 6.1 Auto-Deploy from GitHub

Vercel automatically deploys when you push to main branch:

```bash
# Make changes
git add .
git commit -m "Fix bug"
git push origin main

# Vercel automatically deploys
# Check deployment at vercel.com/dashboard
```

### 6.2 Preview Deployments

Create pull requests to test changes before merging:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request on GitHub
# Vercel creates preview deployment
# Test at provided preview URL
```

### 6.3 Rollback

To rollback to previous deployment:

1. Go to Vercel project
2. Click "Deployments"
3. Find previous deployment
4. Click the three dots menu
5. Select "Promote to Production"

## Step 7: Monitoring & Maintenance

### 7.1 Set Up Error Monitoring

Consider integrating error tracking:
- Sentry for error logging
- LogRocket for session replays
- New Relic for performance monitoring

### 7.2 Monitor Performance

1. Go to Vercel Analytics
2. Check Core Web Vitals
3. Optimize if metrics are poor
4. Monitor database query performance

### 7.3 Regular Updates

```bash
# Update dependencies monthly
npm update
npm audit fix

# Test locally
npm run build
npm run dev

# Deploy after testing
git add .
git commit -m "Update dependencies"
git push origin main
```

## Troubleshooting

### Deployment Fails

1. Check build logs in Vercel
2. Verify all environment variables are set
3. Check for TypeScript errors
4. Ensure all dependencies are listed in package.json

### Database Connection Error

1. Verify Supabase project is active
2. Check environment variable values
3. Verify API key permissions
4. Check network connectivity

### 404 Errors on Routes

1. Verify file structure matches routes
2. Check for typos in page paths
3. Rebuild and redeploy
4. Clear browser cache

### 3D Models Not Loading

1. Check Three.js package is installed
2. Verify CORS headers are correct
3. Check browser console for errors
4. Ensure models are properly exported

### Slow Performance

1. Check Vercel Analytics for metrics
2. Optimize images
3. Enable caching
4. Consider upgrading Vercel plan

## Production Checklist

- [ ] Environment variables configured
- [ ] Database tables created and migrated
- [ ] Row Level Security (RLS) policies set
- [ ] API keys obtained from Supabase
- [ ] Build succeeds locally
- [ ] All tests pass
- [ ] GitHub repository is clean
- [ ] README is updated
- [ ] Legal pages created (Privacy, Terms)
- [ ] Error monitoring configured
- [ ] Domain configured
- [ ] SSL certificate enabled
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Team access configured in Vercel

## Support

If you encounter issues during deployment:

1. Check Vercel documentation: https://vercel.com/docs
2. Check Supabase documentation: https://supabase.com/docs
3. Search GitHub issues for solutions
4. Contact Vercel support for infrastructure issues
5. Contact Supabase support for database issues

## Security Reminders

- Never commit `.env` files
- Use strong passwords and API keys
- Rotate keys periodically
- Enable 2FA on Vercel and Supabase
- Restrict team member access to production
- Monitor audit logs for unauthorized access
- Regularly review security settings
