import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGallery = async(array) =>{
    const response = { status: false, image : null}
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA) // Le preguntamos al sistema operativo movil si me otorgara permisos sobre la camara
    if (resultPermissions.status === "denied") {
        Alert.alert("Dedes de darle permiso para acceder a las imágenes de teléfono.")
        return response
    }

    const result = await ImagePicker.launchImageLibraryAsync({             //launchImageLibraryAsync me permite tomar imagenes de la galeria del teléfono
        allowsEditing : true,    //Para que el user pueda seleccionar la imagen en galeria
        aspect: array
    })

    if (result.cancelled) {  //Validamos si el user eligio o no la foto de su galeria
        return response
    }

    response.status= true //Si eligio una foto es porque su status es verdadero
    response.image = result.uri  //La url donde nos queda la imagen
    return response
}

export const fileToBlob = async(path) =>{
     const file = await fetch(path)        //Esperamos a que nos traiga la imagen y hacemos un fetch para que nos deje la imagen en una ruta local 
     const blob = await file.blob()
     return blob
}
