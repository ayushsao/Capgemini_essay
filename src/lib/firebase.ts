// // Firebase configuration
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// // Your Firebase config (replace with your actual config)
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "your-app-id"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB1HOfI6JzUtHFfF7HXyvRX57QLhO_gadw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "capgemini-essay-tutor.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "capgemini-essay-tutor",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "capgemini-essay-tutor.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "937900597976",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:937900597976:web:1dc56df0b6466a4201adad",
  measurementId: "G-ZQXXW5PT0Q"
};

// Debug: Log configuration (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Config Loaded:', {
    apiKey: firebaseConfig.apiKey ? '✅ Loaded' : '❌ Missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  });
}

// Production environment check
if (typeof window !== 'undefined') {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  if (isProduction) {
    console.log('🌐 Production environment detected:', window.location.hostname);
    console.log('🔥 Firebase Auth Domain:', firebaseConfig.authDomain);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
