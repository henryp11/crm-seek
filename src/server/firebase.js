import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByIp1_DRNvbV4lBD4BqKRE6gqsfE1rAVM",
  authDomain: "crm-cot-itv.firebaseapp.com",
  projectId: "crm-cot-itv",
  storageBucket: "crm-cot-itv.appspot.com",
  messagingSenderId: "275102145103",
  appId: "1:275102145103:web:632d0eae54d0789f90283a",
  measurementId: "G-7N49J4DN30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
