# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `capgemini-essay-tutor`
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location (closest to your users)
5. Done!

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web (</>) icon
4. Register app name: `essay-tutor-web`
5. Copy the config object

## Step 4: Update Firebase Config

Replace the config in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id", 
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Step 5: Set Firestore Rules (Optional for Production)

In Firestore Database → Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users (development only)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 6: Test Firebase Integration

1. Run your app: `npm run dev`
2. Register a new user
3. Check Firestore Console to see the new user data
4. Login as admin (`ayushsao32@gmail.com` / `password`) to see users in User Management

## Current Features with Firebase:

✅ **User Registration**: Saves to Firestore `users` collection
✅ **User Management**: Admin can view all Firebase users  
✅ **Real-time Data**: Auto-refreshes user list
✅ **Fallback Support**: Works with demo users if Firebase fails

## Next Steps:

- Enable Firebase Authentication for better security
- Add essay storage to Firestore
- Implement real-time updates
- Add user roles and permissions

## Troubleshooting:

If Firebase doesn't work:
- Check console for errors
- Verify config values are correct
- Ensure Firestore rules allow access
- The app falls back to demo users automatically
