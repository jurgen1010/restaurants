import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { getDocumentById } from '../../utils/actions'

import Loading from '../../components/Loading'

export default function Restaurant({ navigation, route }) {

    const { id , name } = route.params

    const [restaurant, setRestaurant] = useState(null)

    useEffect(() => {
       (async() =>{
            const response = await getDocumentById("restaurants", id)
            if(response.statusResponse){
                setRestaurant(response.document)
            }else{
                setRestaurant({})  //Sino tiene informacion declaramos un objeto vacio
                Alert.alert("Ocurrió un problema cargando el restaurante, Intente más tarde.")
            }
       })()  //Doble () indica que sera autollamada
    }, [])  //Vamos a ejecutar el useEffect cuando cargue la pantalla

    if (!restaurant) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    navigation.setOptions({ title: name })
    return (
        <View>
            <Text>{restaurant.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
