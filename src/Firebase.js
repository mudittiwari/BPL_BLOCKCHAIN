import { initializeApp } from "firebase/app";
// import firebase from 'firebase/compat/firestore/dist/';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtvn35NlEFgG8GmDeqLZ6sfEkddX0GWM8",
  authDomain: "blockchainstorage-8a2ed.firebaseapp.com",
  projectId: "blockchainstorage-8a2ed",
  storageBucket: "blockchainstorage-8a2ed.appspot.com",
  messagingSenderId: "546991175491",
  appId: "1:546991175491:web:40eb4a4ae6b43b98d021f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;