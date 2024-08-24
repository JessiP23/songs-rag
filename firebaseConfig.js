// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {collection, getFirestore, addDoc, getDocs} from 'firebase/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHUYQ4z4CrpxUYkGsQ8dyMAo4gNaWNVcg",
  authDomain: "song-c1ae1.firebaseapp.com",
  projectId: "song-c1ae1",
  storageBucket: "song-c1ae1.appspot.com",
  messagingSenderId: "1282235676",
  appId: "1:1282235676:web:af0bbbebdab39d84f96ed9",
  measurementId: "G-K69TLJBYSH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, collection, addDoc, getDocs}
