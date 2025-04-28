// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApeEVwhom9zso3DGMhkXd13yhSB0Rb_Cw",
  authDomain: "eztripai.firebaseapp.com",
  projectId: "eztripai",
  storageBucket: "eztripai.firebasestorage.app",
  messagingSenderId: "72056103561",
  appId: "1:72056103561:web:0921888149453745de9c58",
  measurementId: "G-8MJB5DQMX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);