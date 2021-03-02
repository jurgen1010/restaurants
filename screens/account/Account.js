import React, {useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Loading from '../../components/Loading'
import { getCurrentUser } from '../../utils/actions'


import UserGuest from './UserGuest'
import UserLogged from './UserLogged'

export default function Account() {

    const [login, setLogin] = useState(null) //State para validar si el user esta o no loggeado 

    useEffect(() => {                        //Al cargar la pantalla en el menu de account validamos si el user esta o no loggeado.
        const user = getCurrentUser()
        user ? setLogin(true) : setLogin(false)
    }, [])        

    if (login == null) {
        return <Loading isVisible={true} text="Cargando..."/>                  //En caso de que el user no este loggeado llamamos a nuestro componete para hacer uso del activity indicator
    }
    
    return  login ? <UserLogged/> : <UserGuest/>        //Si llega a este punto es porque el user si pudo loggearse y pintamos la pantalla de UserLogged

}

const styles = StyleSheet.create({})
