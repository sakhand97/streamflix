import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFHzXWyms3DrBUIaecTceEogxgmTOrb80",
  authDomain: "streamflix-6cfbd.firebaseapp.com",
  projectId: "streamflix-6cfbd",
  storageBucket: "streamflix-6cfbd.firebasestorage.app",
  messagingSenderId: "659088495466",
  appId: "1:659088495466:web:f7ba213dd703b19a824b13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

