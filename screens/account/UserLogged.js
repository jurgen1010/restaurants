import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'


import { closeSession, getCurrentUser } from '../../utils/actions'
import Loading from '../../components/Loading'
import InfoUser from '../../components/account/InfoUser'

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        setUser(getCurrentUser())    //Siempre que cargue la pagina haremos llamado al usuario actualmente loggeado
    }, [])

    return (
        <View style ={styles.container}>
            {
                user && <InfoUser user={user}/>  // Le enviaremos como parametro el user loggeado a InfoUser en caso de que exista un user loggeado
            }  
            <Text>Account Options</Text>
            <Button
                title="Cerrar Sesión"
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionTitle}
                onPress={()=> {
                    closeSession()
                    navigation.navigate("restaurants")
                }}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} Text={loadingText}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: "100%",
        backgroundColor: "#f9f9f9"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#713853",
        borderBottomWidth: 1,
        borderBottomColor: "#713853",
        paddingVertical: 10
    },
    btnCloseSessionTitle: {
        color: "#713853"
    }
})
