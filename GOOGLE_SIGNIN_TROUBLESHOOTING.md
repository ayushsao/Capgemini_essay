# Google Sign-In Troubleshooting Guide

## Common Issues and Solutions

### 1. "Unauthorized Domain" Error

**Problem**: Domain not authorized for Google Sign-In
**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `capgemini-essay-tutor`
3. Navigate to Authentication → Settings → Authorized domains
4. Add the following domains:
   - `localhost` (for development)
   - Your deployment domain (e.g., `your-app.vercel.app`)
   - `capgemini-essay-tutor.firebaseapp.com`

### 2. "Popup Blocked" Error

**Problem**: Browser blocking the Google Sign-In popup
**Solution**:
1. Look for popup blocker icon in browser address bar
2. Allow popups for this site
3. Disable browser popup blockers
4. Try again

### 3. "Operation Not Allowed" Error

**Problem**: Google Sign-In not enabled in Firebase
**Solution**:
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Google" provider
3. Enable the provider
4. Add support email
5. Save configuration

### 4. OAuth Consent Screen Issues

**Problem**: OAuth consent screen not configured
**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `capgemini-essay-tutor`
3. Navigate to APIs & Services → OAuth consent screen
4. Configure app information:
   - App name: "EssayPolish"
   - User support email: your email
   - Developer contact: your email
5. Add authorized domains
6. Save and publish (if needed)

### 5. Network/Configuration Errors

**Problem**: Invalid API keys or network issues
**Solution**:
1. Check environment variables are set correctly
2. Verify Firebase project configuration
3. Ensure internet connection is stable
4. Check browser console for detailed errors

## Development Setup

### Required Environment Variables
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Testing Checklist
- [ ] Firebase project configured
- [ ] Google authentication enabled
- [ ] Authorized domains added
- [ ] OAuth consent screen configured
- [ ] Environment variables set
- [ ] HTTPS enabled (for production)

## Debugging Steps

1. **Check Browser Console**: Look for detailed error messages
2. **Use Diagnostics**: Click "Having issues with Google Sign-In?" link
3. **Verify Configuration**: Use the diagnostic tool to check settings
4. **Test on Different Browsers**: Try Chrome, Firefox, Safari
5. **Test on Different Networks**: Try different internet connections

## Contact Support

If issues persist after following this guide:
1. Copy the diagnostic information from the app
2. Include browser console errors
3. Specify your deployment environment
4. Contact: ayushsao32@gmail.com

## Fallback Options

If Google Sign-In continues to fail:
1. Use email/password authentication
2. All features remain available
3. Account can be upgraded later
4. Manual account linking available
