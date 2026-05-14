import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

import {
  getAuth,
} from "firebase/auth";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC26enGvaj0Ca2YfCunUIAmNtcPvHP4GNU",

  authDomain:
    "posyandu-a687d.firebaseapp.com",

  projectId: "posyandu-a687d",

  storageBucket:
    "posyandu-a687d.firebasestorage.app",

  messagingSenderId:
    "322824890086",

  appId:
    "1:322824890086:web:b432d320bbac7e95b7bd27",

  measurementId:
    "G-BE29BLPPG9",
};

// CEGAH DOUBLE INITIALIZE
const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

// FIRESTORE
export const db = getFirestore(app);

// AUTH
export const auth = getAuth(app);

export default app;