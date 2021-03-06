import { firebaseApp } from './firebase'
import firebase from 'firebase'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export const isUserLogged = () => { //Para validar si el usuario esta o no loggeado
   let isLogged = false
   firebase.auth().onAuthStateChanged((user) => {   //Nos puede indicar cuando un user pasa de estar loggeado a no loggeado
       user !== null && (isLogged = true)           // Si el user es diferente de null es porque esta loggeado
   })  
   return isLogged
}

export const getCurrentUser = () =>{
    return firebase.auth().currentUser
}