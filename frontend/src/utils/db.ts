import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDC7E1PFBVS3yr-c_O1-ZKOfn07qneN1fk",
  authDomain: "voicechat-656db.firebaseapp.com",
  projectId: "voicechat-656db",
  storageBucket: "voicechat-656db.firebasestorage.app",
  messagingSenderId: "273356131450",
  appId: "1:273356131450:web:cba26db5119893a616bfc3",
  measurementId: "G-SJ7WYWMDQS",
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
