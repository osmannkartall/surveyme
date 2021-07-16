import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: '<your-api-key>',
  authDomain: '<your-authDomain>',
  projectId: '<your-projectId>',
  storageBucket: '<your-storageBucket>',
  messagingSenderId: '<your-messagingSenderId>',
  appId: '<your-appId>',
};

if (!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const firestore = firebase.firestore();

const usersRef = firestore.collection('users');
const surveysRef = firestore.collection('surveys');
const submissionsRef = firestore.collection('submissions');

export { auth, usersRef, surveysRef, submissionsRef };
