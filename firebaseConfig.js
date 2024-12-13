// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

import { collection, getFirestore } from "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyDvA5fKJHtavuLkAZgxvVSVGiE886mzya4",
    authDomain: "laijau-rideshare.firebaseapp.com",
    projectId: "laijau-rideshare",
    storageBucket: "laijau-rideshare.firebasestorage.app",
    messagingSenderId: "937795761539",
    appId: "1:937795761539:web:7210a356cbd7c65f2bf2b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database= getFirestore();
