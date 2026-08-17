import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC86IWNuCeQnrQBFcoou94LtdkUVmoC7Rg",
  authDomain: "beatflix-90244.firebaseapp.com",
  projectId: "beatflix-90244",
  storageBucket: "beatflix-90244.firebasestorage.app",
  messagingSenderId: "249730339081",
  appId: "1:249730339081:web:451c4e9a7f7a5448dd83d8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();