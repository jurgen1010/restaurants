import React, {useState, useEffect, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Loading from '../../components/Loading'
import { getCurrentUser, isUserLogged } from '../../utils/actions'
import { useFocusEffect } from '@react-navigation/native'


import UserGuest from './UserGuest'
import UserLogged from './UserLogged'

export default function Account() {

    const [login, setLogin] = useState(null) //State para validar si el user esta o no loggeado 

    //COn el hook de callBack cada que pasemos por esta pantalla el ejecutara siempre el metodo setLogin para validar si hay un user actualmente loggeado.
    useFocusEffect (
        useCallback(() => {
            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        }, [])
    )


    if (login == null) {
        return <Loading isVisible={true} text="Cargando..."/>                  //En caso de que el user no este loggeado llamamos a nuestro componete para hacer uso del activity indicator
    }
    
    return  login ? <UserLogged/> : <UserGuest/>        //Si llega a este punto es porque el user si pudo loggearse y pintamos la pantalla de UserLogged

}

const styles = StyleSheet.create({})
