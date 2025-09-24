import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBzkwZXGBn6C-NPlDfE6NqZpMqOzNzukSE",
    authDomain: "creche-escola.firebaseapp.com",
    projectId: "creche-escola",
    storageBucket: "creche-escola.firebasestorage.app",
    messagingSenderId: "645453044705",
    appId: "1:645453044705:web:48873c03944b9fae6b50a0",
    measurementId: "G-KLSG0S7EPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;