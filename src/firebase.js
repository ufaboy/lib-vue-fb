import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

let firebaseApp = initializeApp(firebaseConfig);

firebaseApp.getCurrentUser = () => {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};

export const db = getFirestore();

export default firebaseApp