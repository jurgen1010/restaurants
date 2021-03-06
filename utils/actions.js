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

export const getCurrentUser = () =>{                //La manera en como podremos consultar el usuario actual
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registerUser = async(email, password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)  //De esta sabemos si podemos o no crear un user con password y contraseña en firebase
    } catch (error) {
        result.error = "Este correo ya ha sido registrado"
    }
    return result
}

