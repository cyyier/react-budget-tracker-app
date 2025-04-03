// src/config/firebaseConfig.js
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, push} from 'firebase/database';

const firebaseConfig = {
  【非公開】
};

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);
// 获取数据库实例
const database = getDatabase(app);

export {database};
