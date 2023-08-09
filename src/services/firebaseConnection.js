import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyASN-sNyTqhTIRcr95jmycMz6f3HbevDAU",
  authDomain: "tickets-480c4.firebaseapp.com",
  projectId: "tickets-480c4",
  storageBucket: "tickets-480c4.appspot.com",
  messagingSenderId: "231391947648",
  appId: "1:231391947648:web:5026e3c0add86d0c34af65",
  measurementId: "G-JKWTEMZ32M"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);

export{auth, db, storage};