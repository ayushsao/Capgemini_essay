# Google Sign-In Production Deployment Guide

## Common Issues & Solutions

### 1. Authorized Domains Configuration

**Problem**: Google Sign-In works locally but fails in production with error `auth/unauthorized-domain`

**Solution**: Add your production domain to Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `capgemini-essay-tutor`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add your production domain (e.g., `your-app.vercel.app`, `your-app.netlify.app`)

### 2. Environment Variables Setup

**Problem**: Firebase configuration not loaded in production

**For Vercel:**
```bash
# In Vercel Dashboard → Project → Settings → Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB1HOfI6JzUtHFfF7HXyvRX57QLhO_gadw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=capgemini-essay-tutor.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=capgemini-essay-tutor
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=capgemini-essay-tutor.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=937900597976
NEXT_PUBLIC_FIREBASE_APP_ID=1:937900597976:web:1dc56df0b6466a4201adad
```

**For Netlify:**
```bash
# In Netlify Dashboard → Site settings → Environment variables
# Add the same variables as above
```

### 3. CORS Configuration

**Problem**: Cross-origin request blocked

**Solution**: Ensure your Firebase project allows requests from your domain
- Firebase automatically handles CORS for authorized domains
- Make sure your domain is in the authorized domains list

### 4. Google Cloud Console Configuration

**Problem**: OAuth client not configured for production domain

**Solution**: Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `capgemini-essay-tutor`
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 client ID
5. Add your production domain to **Authorized JavaScript origins**
6. Add your production domain to **Authorized redirect URIs**

### 5. Production Debugging

Add this to your production build to debug issues:

```javascript
// Add to your Google sign-in component
console.log('Environment Check:', {
  domain: window.location.hostname,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'Missing'
});
```

## Step-by-Step Production Setup

### Step 1: Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select `capgemini-essay-tutor` project
3. Go to Authentication → Settings
4. Under "Authorized domains", click "Add domain"
5. Add your production URL (without https://)

### Step 2: Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select the same project
3. Go to APIs & Services → Credentials
4. Edit the OAuth 2.0 client ID
5. Add production domain to authorized origins

### Step 3: Hosting Platform
1. Set all NEXT_PUBLIC_FIREBASE_* environment variables
2. Redeploy your application
3. Test Google Sign-In on production

## Quick Commands to Check Issues

```bash
# Check if environment variables are set
echo $NEXT_PUBLIC_FIREBASE_API_KEY

# Check current authorized domains
# (Run this in browser console on your production site)
console.log('Current domain:', window.location.hostname);
console.log('Firebase auth domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
```

## Testing Checklist

- [ ] Production domain added to Firebase authorized domains
- [ ] Environment variables set in hosting platform
- [ ] Google Cloud Console OAuth configured
- [ ] Browser console shows no CORS errors
- [ ] Firebase config loads correctly in production
- [ ] Google Sign-In popup opens without errors

## Common Error Messages

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/unauthorized-domain` | Domain not authorized | Add domain to Firebase Console |
| `auth/popup-blocked` | Browser blocked popup | User needs to allow popups |
| `auth/network-request-failed` | Network/CORS issue | Check domain authorization |
| `auth/configuration-not-found` | Missing config | Check environment variables |

## Need Help?

If you're still having issues, please provide:
1. Your production URL
2. Browser console error messages
3. Firebase project ID
4. Hosting platform (Vercel, Netlify, etc.)
