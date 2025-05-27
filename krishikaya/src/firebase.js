// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {

    apiKey: "AIzaSyB3jW3-sle79FWEaG04hlVLIGwQx5MjA8E",
  
    authDomain: "marketplace-rental.firebaseapp.com",
  
    databaseURL: "https://marketplace-rental-default-rtdb.firebaseio.com",
  
    projectId: "marketplace-rental",
  
    storageBucket: "marketplace-rental.appspot.com",
  
    messagingSenderId: "652743767042",
  
    appId: "1:652743767042:web:e41360da55a03272a9e31b",
  
    measurementId: "G-KM8TB12PYH"
  };
  
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
