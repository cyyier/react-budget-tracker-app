// src/config/firebaseConfig.js
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, push} from 'firebase/database';

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

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);
// 获取数据库实例
const database = getDatabase(app);

export {database};
