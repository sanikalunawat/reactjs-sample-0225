import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";            
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-auth-domain-here",
  projectId: "your-project-id-here",
  storageBucket: "your-storage-bucket-here",
  messagingSenderId: "your-messaging-sender-id-here",
  appId: "your-app-id-here",
  measurementId: "your-measurement-id-here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };