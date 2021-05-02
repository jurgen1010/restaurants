import { firebaseApp } from './firebase'
import firebase from 'firebase'
import 'firebase/firestore'

import { fileToBlob } from './helpers'
import { diffClamp } from 'react-native-reanimated'
import { map } from 'lodash'

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
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado."
    }
    return result
}

export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)  //De esta sabemos si podemos o no crear un user con password y contraseña en firebase
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no válidos"
    }
    return result
}

export const uploadImage = async(image, path, name)=>{
    const result = {statusResponse: false, error: null, url: null}  //Asumimos siempre un estado inicial de la respuesta que obtendremos
    const ref = firebase.storage().ref(path).child(name)            //La forma en como referenciamos la imagen a subir como blob
    const blob = await fileToBlob(image)                            //Usamos nuestra utilidad para convertir la imagen a un blob
    try {
        await ref.put(blob)                                        //La forma en como subimos la imagen 
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()   //La forma en como obtenemos la ruta de como nos quedo guardada la imagen, ademas usamos el template string `${path}/${name}`
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async(data) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateProfile(data)    //La forma en como actualizamos la informacion del perfil actual con la data que le enviemos
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential( user.email, password ) // la manera de como obtenemos las credenciales del user actual

    try {
        await user.reauthenticateWithCredential(credentials)     //Finalmente nos reautenticamos
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)   //Actualizamos el email del usuario
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)   //Actualizamos el password del usuario
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).add(data)                   // Agregar un nuevo documento a una colección en firebase
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getRestaurants = async(limitRestaurants) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
            result.startRestaurant = response.docs[response.docs.length-1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}


export const getMoreRestaurants = async(limitRestaurants, startRestaurant) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt)
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
            result.startRestaurant = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()                   // Como recuperar un documento por id
        result.document = response.data()                                                //Para poder obtener el contenido del documento menos el id
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getRestaurantReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviews")
            .where("idRestaurant", "==", id)
            .get()
        response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    console.log(result)
    return result
}

export const getIsFavorite = async(idRestaurant) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
        const response = await db
        .collection("favorites")
        .where("idRestaurant", "==", idRestaurant)   
        .where("idUser", "==", getCurrentUser().uid)
        .get()         

        result.isFavorite = response.docs.length > 0       //Si recupera registro es porque sabemos que el restaurante es favorito
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const deleteFavorite = async(idRestaurant) => {
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
            .collection("favorites")
            .where("idRestaurant", "==", idRestaurant)   
            .where("idUser", "==", getCurrentUser().uid)
            .get()         
        response.forEach(async(doc) =>{
            const favoriteId= doc.id
            await db.collection("favorites").doc(favoriteId).delete()               //Eliminamos el registro de favoritos
        })
    } catch (error) { 
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getFavorites = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .get()         
        await Promise.all(                                        //Es neceario envolver el map dentro de un Promis.all ya que por cada idRestaurant traeremos toda su informacion a traves de otro metodo asincrono getDocumentById
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const restaurant = await getDocumentById("restaurants", favorite.idRestaurant)
                if (restaurant.statusResponse) {
                    result.favorites.push(restaurant.document)
                }
            })
        )
    } catch (error) { 
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getTopRestaurants = async(limit) => {
    const result = { statusResponse: true, error: null, restaurants: [] }
    try {
        const response = await db
        .collection("restaurants")
        .orderBy("rating", "desc")
        .limit(limit)
        .get()         
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
        result.isFavorite = response.docs.length > 0       
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}