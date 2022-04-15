// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCGlx5BQsdj9T2Ai2nZZoPZadtjKxf27Nw',
  authDomain: 'binary-search-dating.firebaseapp.com',
  projectId: 'binary-search-dating',
  storageBucket: 'binary-search-dating.appspot.com',
  messagingSenderId: '160076250826',
  appId: '1:160076250826:web:4a976721c97c4bcb783e33',
  measurementId: 'G-XSJNYP7WPX',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
