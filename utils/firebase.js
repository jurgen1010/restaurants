  import firebase from 'firebase/app'
  import 'firebase/firestore'

  const firebaseConfig = {
    apiKey: "AIzaSyAUIueZ42FMHFvtavWU3Llz3IHa_I9coNY",
    authDomain: "restaurants-5cb23.firebaseapp.com",
    projectId: "restaurants-5cb23",
    storageBucket: "restaurants-5cb23.appspot.com",
    messagingSenderId: "245367707610",
    appId: "1:245367707610:web:783dfbc06f3fde310712e3"
  }
  
  export const firebaseApp = firebase.initializeApp(firebaseConfig)