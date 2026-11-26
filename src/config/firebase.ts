
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase ONESAY
const firebaseConfig = {
  apiKey: "AIzaSyBhI0H7LcCR2Ixye2_P2l4e2quVvvz-t4w",
  authDomain: "onesayschoolmanagementsystem.firebaseapp.com",
  projectId: "onesayschoolmanagementsystem",
  storageBucket: "onesayschoolmanagementsystem.firebasestorage.app",
  messagingSenderId: "373755422269",
  appId: "1:373755422269:web:126bb0237e49651a1a2c54",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Cloud Firestore
export const db = getFirestore(app);

// Firebase Storage untuk foto profil dan berkas aplikasi
export const storage = getStorage(app);

export default app;
