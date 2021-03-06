import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Alert, Dimensions ,ScrollView, StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash'
import { Icon, Rating,  ListItem } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import { getDocumentById, addDocumentWithoutId, getCurrentUser, getIsFavorite, deleteFavorite } from '../../utils/actions'
import Loading from '../../components/Loading'
import CarouselImage from '../../components/CarouselImage'
import { callNumber, formatPhone, sendEmail, sendWhatsApp } from '../../utils/helpers'
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
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)

    firebase.auth().onAuthStateChanged(user =>{
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)                    //Obtenemos el user que esta logueado
    })
    
    navigation.setOptions({ title: name })

    useFocusEffect(
        useCallback(() => {
           (async() =>{
                const response = await getDocumentById("restaurants", id)
                if(response.statusResponse){
                    setRestaurant(response.document)
                }else{
                    setRestaurant({})                        //Sino tiene informacion declaramos un objeto vacio
                    Alert.alert("Ocurrió un problema cargando el restaurante, Intente más tarde.")
                }
           })()  //Doble () indica que sera autollamada
        }, [])  //Vamos a ejecutar el useEffect cuando cargue la pantalla
    )

    useEffect(() => {
        (async() =>{
            if (userLogged && restaurant) {
                const response = await getIsFavorite(restaurant.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, restaurant])                    //Realizara la consulta cuando el usuario y el restaurante esten cargados.

    if (!restaurant) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    const addFavorite = async()=>{
        if (!userLogged) {
            toastRef.current.show("Para agregar el restaurante a favoritos debes estar logueado.", 3000)
            return
        }

        setLoading(true)
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrentUser().uid,
            idRestaurant: restaurant.id
        })

        setLoading(false)
        if (response.statusResponse) {
           setIsFavorite(true) 
           toastRef.current.show("Restaurante añadido a favoritos", 3000)
        } else{
            toastRef.current.show("No se pudo agregar el restaurante a favoritos. Por favor intenta más tarde", 3000)
        }
    }

    const removeFavorite = async() => {
       setLoading(true)
       const response = await deleteFavorite(restaurant.id)
       setLoading(false)
       if (response.statusResponse) {
           setIsFavorite(false)
           toastRef.current.show("Restaurante eliminado de favoritos", 3000)
        } else{
            toastRef.current.show("No se pudo eliminar el restaurante de favoritos. Por favor intenta más tarde", 3000)
        }
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
                    color="#c42434"
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
                currentUser={currentUser}
                callingCode={restaurant.callingCode}
                phoneNoFormat={restaurant.phone}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text={"Por favor espere..."}/>
        </ScrollView>
    )
}

function RestaurantInfo({ name,  location, address, email,  phone, currentUser, callingCode, phoneNoFormat  }){
    const listInfo = [
        { type: "addres", text: address, iconLeft: "map-marker" },
        { type: "phone", text: phone, iconLeft: "phone", iconRight: "whatsapp"},
        { type: "email", text: email, iconLeft: "at",  actionLeft: "sendEmail"},
    ]

    const actionLeft = (type) => {
        if (type == "phone") {
            callNumber(phone)
        }else if (type == "email") {
            if (currentUser) {
                sendEmail(email, "Interesado", `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            }else{
                sendEmail(email, "Interesado", `Estoy interesado en sus servicios`)
            }
        }
    }

    const actioRight = (type) => {
        if (type == "phone") {
            if (currentUser) {
                sendWhatsApp(`${callingCode}${phoneNoFormat}`, `Soy ${currentUser.displayName}, estoy interesado en sus servicios`)
            }else{
                sendWhatsApp(`${callingCode}${phoneNoFormat}`, `Estoy interesado en sus servicios`)
            }
        }
    }

    

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
                            name={item.iconLeft}
                            color="#713853"
                            onPress={() => actionLeft(item.type)}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (
                                <Icon
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#713853"
                                    onPress={() => actioRight(item.type)}
                                />
                            )
                        }
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
