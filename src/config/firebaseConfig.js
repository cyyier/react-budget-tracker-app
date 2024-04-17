// src/config/firebaseConfig.js
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyD9a311G9MkXIQF6UD1xTrBt6I-U123ozo',
  authDomain: 'kakeibo-rumiso.firebaseapp.com',
  databaseURL:
    'https://kakeibo-rumiso-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'kakeibo-rumiso',
  storageBucket: 'kakeibo-rumiso.appspot.com',
  messagingSenderId: '647040789893',
  appId: '1:647040789893:android:fc7c16640825ace51028ec',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();
