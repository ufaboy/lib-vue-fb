// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
// eslint-disable-next-line no-unused-vars
import { getAuth } from 'firebase/auth';
// eslint-disable-next-line no-unused-vars
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAr8fuTEOIZRzH9VQSiPl9kuHRPoLUK9Ew",
    authDomain: "library-api-9b73a.firebaseapp.com",
    projectId: "library-api-9b73a",
    storageBucket: "library-api-9b73a.appspot.com",
    messagingSenderId: "503682698024",
    appId: "1:503682698024:web:e54826f4ea47d477279e1d",
    measurementId: "G-N8RL4647K4"
}

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp