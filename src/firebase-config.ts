import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBZjfCoOmB85y7-KpsfltJNAxZS8ZmvZdE',
    authDomain: 'match-dev-movies-comments.firebaseapp.com',  
    projectId: 'match-dev-movies-comments',
    storageBucket: 'match-dev-movies-comments.appspot.com',
    messagingSenderId: '637991375056',
    appId: '1:637991375056:web:3f86428a65dd19b0560ed5'
};

export const DB = getFirestore(initializeApp(firebaseConfig));