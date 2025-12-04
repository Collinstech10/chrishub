// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB5y0mKXGy-Cfc3kqj6PFvz6dc62y6oet0",
  authDomain: "chrishub-2b46d.firebaseapp.com",
  projectId: "chrishub-2b46d",
  storageBucket: "chrishub-2b46d.firebasestorage.app",
  messagingSenderId: "50931882852",
  appId: "1:50931882852:android:9867c992594bef212ab871"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);