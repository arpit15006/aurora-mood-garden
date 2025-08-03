# Vercel Deployment Guide

## Environment Variables Setup

### Required Environment Variables
Add these in your Vercel dashboard under **Settings > Environment Variables**:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Important Notes:
1. **All variables must start with `VITE_`** for Vite to include them in the build
2. Set environment variables for **all environments** (Production, Preview, Development)
3. After adding variables, **redeploy** the application

### Steps to Fix Clerk Error:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk publishable key
5. Make sure to select **Production**, **Preview**, and **Development**
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

### Getting Your Clerk Key:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **API Keys**
4. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### Troubleshooting:
- Ensure the key starts with `pk_test_` or `pk_live_`
- Check that the variable name is exactly `VITE_CLERK_PUBLISHABLE_KEY`
- Verify the key is set for all environments
- Redeploy after adding variables