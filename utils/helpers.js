import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location  from "expo-location";
import { Alert, Linking } from 'react-native'
import { size } from 'lodash';

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

export const getCurrentLocation = async()=>{
    const response = {status: false, location: null}
    const resultPermissions = await Permissions.askAsync(Permissions.LOCATION)  //Le preguntaremos a el user que nos de permisos de location del dispositivo
    if (resultPermissions.status === "denied") {
        Alert.alert("Debes dar permisos para la localización.")
        return response
    }

    const position = await Location.getCurrentPositionAsync({})      //La forma en como obtenemos la posicion
    const location = {
        latitude: position.coords.latitude,                          //La forma en como podemos obtener la latitud y longitud
        longitude: position.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }
    response.status = true
    response.location = location
    return response
}

export const formatPhone = (callingCode, phone) => {
    if (size(phone) < 10)
    {
        return `+(${callingCode}) ${phone}`
    }
    return `+(${callingCode}) ${phone.substr(0, 3)} ${phone.substr(3, 3)} ${phone.substr(6, 4)}`
}

export const callNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
}

export const sendWhatsApp = (phoneNumber, text) => {
    const link = `https://wa.me/${phoneNumber}?text=${text}`
    Linking.canOpenURL(link).then((supported) =>{
        if (!supported) {
            Alert.alert("Por favor instale WhatsApp para enviar un mensaje directo")
            return
        }
        return Linking.openURL(link)
    })
}

export const sendEmail = (to, subject, body) => {
    Linking.openURL(`mailto:${to}?subject=${subject}&body=${body}`)
}




