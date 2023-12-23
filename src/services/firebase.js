import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA6elyfSGEF8K43nPNsxm-Fta5U56TNwWQ',
  authDomain: 'keep-48257.firebaseapp.com',
  projectId: 'keep-48257',
  storageBucket: 'keep-48257.appspot.com',
  messagingSenderId: '159771385842',
  appId: '1:159771385842:web:f6a26efc6765da2bd8d56b',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
