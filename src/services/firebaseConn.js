import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBa-BloSdY1mMMs3hIGBewnJ_CBN_QL26w",
  authDomain: "blog-post-ddafe.firebaseapp.com",
  projectId: "blog-post-ddafe",
  storageBucket: "blog-post-ddafe.appspot.com",
  messagingSenderId: "106254600087",
  appId: "1:106254600087:web:5d7c898fd51955979526d2",
  measurementId: "G-8QHXMVEMCQ"
};

// Initialize Firebase
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;