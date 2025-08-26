// Firebase configuration checker and troubleshooting helper
export const checkFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB1HOfI6JzUtHFfF7HXyvRX57QLhO_gadw",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "capgemini-essay-tutor.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "capgemini-essay-tutor",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "capgemini-essay-tutor.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "937900597976",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:937900597976:web:1dc56df0b6466a4201adad"
  };

  return {
    config,
    isConfigured: !!(config.apiKey && config.authDomain && config.projectId),
    currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    currentUrl: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };
};

export const getFirebaseTroubleshootingInfo = () => {
  const info = checkFirebaseConfig();
  
  return {
    ...info,
    troubleshooting: {
      domainAuthorization: {
        required: [
          'localhost',
          'capgemini-essay-tutor.firebaseapp.com',
          info.currentDomain
        ],
        instructions: `
To fix Google Sign-In issues:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: ${info.config.projectId}
3. Go to Authentication → Settings → Authorized domains
4. Add these domains:
   - localhost (for development)
   - ${info.currentDomain} (current domain)
   - capgemini-essay-tutor.firebaseapp.com (Firebase hosting)

5. Save changes and wait 5-10 minutes for propagation
        `
      },
      googleAuthSetup: {
        instructions: `
To enable Google Sign-In:

1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Google" provider
3. Enable the provider
4. Add your support email
5. Save configuration

For OAuth consent screen (if needed):
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select project: ${info.config.projectId}
3. Go to APIs & Services → OAuth consent screen
4. Configure your app information
5. Add authorized domains
        `
      }
    }
  };
};

// Function to diagnose common Google Sign-In issues
export const diagnoseGoogleSignInIssue = (error: any) => {
  const troubleshooting = getFirebaseTroubleshootingInfo();
  
  if (!error) {
    return {
      issue: 'Unknown error',
      solution: 'Check browser console for detailed error information',
      troubleshooting
    };
  }

  if (error.code) {
    switch (error.code) {
      case 'auth/unauthorized-domain':
        return {
          issue: 'Domain not authorized',
          solution: `Add "${troubleshooting.currentDomain}" to Firebase authorized domains`,
          troubleshooting: troubleshooting.troubleshooting.domainAuthorization
        };
      
      case 'auth/popup-blocked':
        return {
          issue: 'Popup blocked by browser',
          solution: 'Allow popups for this site and try again',
          troubleshooting: {
            instructions: `
1. Look for a popup blocked icon in your browser address bar
2. Click it and allow popups for this site
3. Try Google Sign-In again
4. If still blocked, disable popup blocker for this domain
            `
          }
        };
      
      case 'auth/operation-not-allowed':
        return {
          issue: 'Google Sign-In not enabled',
          solution: 'Enable Google authentication in Firebase Console',
          troubleshooting: troubleshooting.troubleshooting.googleAuthSetup
        };
      
      default:
        return {
          issue: `Firebase Auth Error: ${error.code}`,
          solution: error.message,
          troubleshooting
        };
    }
  }

  return {
    issue: 'General error',
    solution: error.message || 'Unknown error occurred',
    troubleshooting
  };
};
