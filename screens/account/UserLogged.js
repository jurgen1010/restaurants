import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'


import { closeSession, getCurrentUser } from '../../utils/actions'
import Loading from '../../components/Loading'
import InfoUser from '../../components/account/InfoUser'
import AccountOptions from '../../components/account/AccountOptions'

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)
    const [reloadUser, setReloadUser] = useState(false)

    useEffect(() => {
        setUser(getCurrentUser())    //Siempre que cargue la pagina haremos llamado al usuario actualmente loggeado
        setReloadUser(false)
    }, [reloadUser])

    return (
        <View style ={styles.container}>
            {// Le enviaremos como parametro el userloggeado , loading y el texto del loading  a InfoUser en caso de que exista un user loggeado 
                user && (
                    <View>
                        <InfoUser 
                            user={user} 
                            setLoading={setLoading} 
                            setLoadingText={setLoadingText}
                        />
                        <AccountOptions
                            user={user}
                            toastRef={toastRef}
                            setReloadUser={setReloadUser} //Enviamos en status de reloadUser para que cada que cambie nos refresque la pantalla de UserLogged y no pinte las actualizaciones
                        />
                    </View>
                )  
            }  
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
            <Loading isVisible={loading} text={loadingText}/>
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
