import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1s07abN_oYHB2LwnUmiBI-eVc9P57qQ8",
  authDomain: "broadcast-saas-thiago-73267.firebaseapp.com",
  projectId: "broadcast-saas-thiago-73267",
  storageBucket: "broadcast-saas-thiago-73267.firebasestorage.app",
  messagingSenderId: "492346232613",
  appId: "1:492346232613:web:dcf4d27f455a1a12ddd4cc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);