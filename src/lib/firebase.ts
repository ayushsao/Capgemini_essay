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
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1HOfI6JzUtHFfF7HXyvRX57QLhO_gadw",
  authDomain: "capgemini-essay-tutor.firebaseapp.com",
  projectId: "capgemini-essay-tutor",
  storageBucket: "capgemini-essay-tutor.firebasestorage.app",
  messagingSenderId: "937900597976",
  appId: "1:937900597976:web:1dc56df0b6466a4201adad",
  measurementId: "G-ZQXXW5PT0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
