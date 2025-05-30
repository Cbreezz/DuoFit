
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics"; // Analytics can be added if needed later

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3yukeOxkyaFRKofrvekQ7umUXFo3OYL4",
  authDomain: "duofit-b5500.firebaseapp.com",
  projectId: "duofit-b5500",
  storageBucket: "duofit-b5500.appspot.com", // Corrected from firebasestorage.app to appspot.com as per standard
  messagingSenderId: "270157652113",
  appId: "1:270157652113:web:b7b08e7e89a1e69090df30",
  measurementId: "G-XW0QGMLJGL"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
// const analytics = getAnalytics(app); // Initialize analytics if you plan to use it

export { app, auth };
