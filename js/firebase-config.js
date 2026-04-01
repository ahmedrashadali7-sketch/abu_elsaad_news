// إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBiLnQKblUsRxmz6rUWAb7RpbFUakeWX_E",
    authDomain: "abu-el-saad-news.firebaseapp.com",
    projectId: "abu-el-saad-news",
    storageBucket: "abu-el-saad-news.firebasestorage.app",
    messagingSenderId: "127394884030",
    appId: "1:127394884030:web:52a31322a180bc717931ef"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تهيئة Firestore
const db = firebase.firestore();

console.log('✅ Firebase initialized successfully');