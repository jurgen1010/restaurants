import React, {useState} from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'


import { updateProfile, uploadImage } from '../../utils/actions'
import { loadImageFromGallery } from '../../utils/helpers'

export default function InfoUser({ user, setLoading, setLoadingText }) {    //Hacemos detructuring del parametro enviado por props desde UserLogged
    const [photoUrl, setPhotoUrl] = useState(user.photoURL)

    const changePhoto = async()=>{
        const result = await loadImageFromGallery([1, 1])   //Relacion 1, 1 es el mismo ancho con el mismo alto es decir cuadrada
        if (!result.status) {                               //Preguntamos si no pudo cargar la imagen de galeria
            return
        }
        setLoadingText("Actualizando imagen...")
        setLoading(true)                                    //Para que nos active el indicador de actividad como siestuviera procesando

        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid ) //Cargamos la imagen a nuestro storage
        
        if (!resultUploadImage.statusResponse) {
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }
        const resultUpdateProfile = await updateProfile({ photoURL: resultUploadImage.url })  //Finalmente actualizamos el perfil con su foto, enviando la data a actualizar
        setLoading(false)
        if (resultUpdateProfile.statusResponse) {
            setPhotoUrl(resultUploadImage.url)              //En caso de poder actualizar el perfil, le enviamos a nuestro status la url de nuestra nueva imagen
        } else {
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    return (
        <View style={styles.container}>
            <Avatar
                rounded // Redondear es equivalante rounded = {true}
                size="large"
                onPress={changePhoto}
                source={
                    photoUrl  //Usamos nuestro status para validar si exite o no una imagen de perfil
                        ? {uri: photoUrl}
                        : require("../../assets/default-avatar-profile.jpg")
                } 
            />
            <View style= {styles.infoUser}> 
                <Text style={styles.displayName}>
                    {
                        user.displayName ? user.displayName : "Anónimo" //SI el user tiene display name lo mostramos sino mostraremos la palabra Anónimo
                    }
                </Text>
                <Text>{user.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",   //Apilaremos los items de manera horizontal 
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infoUser: {
        marginLeft: 20
    },
    displayName: {
        fontWeight : "bold",
        paddingBottom: 5
    }
})
