import React, { useState, useCallback, useRef } from 'react'
import { Alert, Dimensions ,ScrollView, StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash'
import { Icon, Rating,  ListItem } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'


import { getDocumentById } from '../../utils/actions'
import Loading from '../../components/Loading'
import CarouselImage from '../../components/CarouselImage'
import { formatPhone } from '../../utils/helpers'
import MapRestaurant from '../../components/restaurants/MapRestaurant'
import ListReviews from '../../components/restaurants/ListReviews'

const widthScreen = Dimensions.get("window").width 

export default function Restaurant({ navigation, route }) {
    const { id , name } = route.params
    const toastRef = useRef()

    const [restaurant, setRestaurant] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged(user =>{
        user ? setUserLogged(true) : setUserLogged(false)
    })
    
    navigation.setOptions({ title: name })

    useFocusEffect(
        useCallback(() => {
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
    )

    if (!restaurant) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    const addFavorite = ()=>{
        if (!userLogged) {
            toastRef.current.show("Para agregar el restaurante a favoritos debes estar logueado.", 3000)
            return
        }

        console.log("Vamos bien")
    }

    const removeFavorite = () => {
        console.log("Remove favorite")
    }

    return (
        <ScrollView style={styles.viewBody}>      
            <CarouselImage
                images={restaurant.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite }
                    color={isFavorite ? "#fff" : "#c42434"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={restaurant.rating}
            />
            <RestaurantInfo
                name={restaurant.name}
                location={restaurant.location}
                address={restaurant.address}
                email={restaurant.email}
                phone={formatPhone(restaurant.callingCode, restaurant.phone)}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </ScrollView>
    )
}

function RestaurantInfo({ name,  location, address, email,  phone  }){
    const listInfo = [
        { text: address, iconName: "map-marker" },
        { text: phone, iconName: "phone" },
        { text: email, iconName: "at" },
    ]

    return(
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <MapRestaurant
                location={location}
                name={name}
                height={150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconName}
                            color="#713853"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </View>
    )
}

function TitleRestaurant({ name, description, rating  }){
    return(
        <View style = {styles.viewRestaurantTitle}>
            <View style={styles.viewRestaurantContainer}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly                //para que el user no la pueda modificar
                    startingValue={parseFloat(rating)}   
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15
    },
    viewRestaurantContainer:{
        flexDirection: "row"
    },
    descriptionRestaurant: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0    
    },
    nameRestaurant: {
        fontWeight: "bold"
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#c42434",
        borderBottomWidth: 1
    },
    viewFavorite:{
        position : "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    }
})
