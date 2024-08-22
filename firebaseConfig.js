// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {collection, getFirestore, addDoc, getDocs} from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMTMM8ezIffGkrzeNjxyVTGg74CUozZcI",
  authDomain: "songs-ec929.firebaseapp.com",
  projectId: "songs-ec929",
  storageBucket: "songs-ec929.appspot.com",
  messagingSenderId: "584316092718",
  appId: "1:584316092718:web:0900d15bb57274832c7abf",
  measurementId: "G-NTD4LHV825"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, collection, addDoc, getDocs}
