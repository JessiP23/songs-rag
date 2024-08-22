// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK_-AWqBRV9dV3eiJdOG8JFLXBmFiLvGM",
  authDomain: "song-d8405.firebaseapp.com",
  projectId: "song-d8405",
  storageBucket: "song-d8405.appspot.com",
  messagingSenderId: "1074665744995",
  appId: "1:1074665744995:web:1952be8244673b9201a656",
  measurementId: "G-2RYNNGSC30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 

const db = getFirestore(app)

export {db};