import React, { useState, useEffect } from 'react'
import { Alert, Dimensions ,ScrollView, StyleSheet, Text } from 'react-native'


import { getDocumentById } from '../../utils/actions'
import Loading from '../../components/Loading'
import CarouselImage from '../../components/CarouselImage'

const widthScreen = Dimensions.get("window").width 

export default function Restaurant({ navigation, route }) {

    const { id , name } = route.params
    const [restaurant, setRestaurant] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)

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
        <ScrollView style={styles.viewBody}>
            <CarouselImage
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <Text>{restaurant.description}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1
    }
})
