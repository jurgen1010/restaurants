import React, {useState , useCallback, useRef} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Button, Icon, Image } from 'react-native-elements'
import Toast from 'react-native-easy-toast'

import firebase from 'firebase/app'
import Loading from '../components/Loading'
import { deleteFavorite, getFavorites } from '../utils/actions'

export default function Favorites({ navigation }) {
    const toastRef = useRef()
    const [restaurants, setRestaurants] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)

    firebase.auth().onAuthStateChanged((user) =>{
        user ? setUserLogged(true) : setUserLogged(false)
    })


    useFocusEffect(
        useCallback(() =>{
            if (userLogged) {          
                async function getData(){
                    setLoading(true)
                    const response =  await getFavorites()
                    setRestaurants(response.favorites)
                    setLoading(false)
                }
                getData()
            }
            setReloadData(false)
        }, [userLogged, reloadData])
    )

    if (!userLogged) {
        return <UserNoLogged navigation={navigation}/>
    }

    if (!restaurants) {
        return <Loading isVisible={true} text={"Cargando restaurantes..."}/>
    }else if(restaurants?.length === 0){                            //? Valida cuando es nullo
        return <NotFoundRestaurants/>
    }

    return (
        <View style={styles.viewBody}>
            {
                restaurants ? (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item, index) => index.toString} //Para evitar que nos salga error porque cada elemento de la lista no sea unico
                        renderItem={(restaurant) =>(                   //Usamos los () ya que es un return implicito
                            <Restaurant
                                restaurant={restaurant}
                                setLoading={setLoading}
                                toastRef={toastRef}
                                navigation={navigation}
                                setReloadData= {setReloadData}
                            />
                        )}
                    />
                ):(
                    <View style={styles.loaderRestaurant}>
                        <ActivityIndicator size="large"/>
                        <Text style={{ textAlign: "center"}}>
                            Cargando Restaurantes...
                        </Text>
                    </View>
                )
            }
            <Toast  ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}

function Restaurant({restaurant, setLoading, toastRef, navigation, setReloadData }){
    const { id, name, images } = restaurant.item

    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar restautante de favoritos",
            "¿Esta seguro de querer borrar el restaurante de favoritos?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Si",
                    onPress: removeFavorite
                }
            ],
            { cancelable: false }
        )      
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(id)
        setLoading(false)
        if (response.statusResponse) {
            setReloadData(true)
            toastRef.current.show("Restaurante eliminado de favoritos.", 3000)
        }else{
            toastRef.current.show("Error al eliminar el restaurante de favoritos.", 3000)
        }
    }

    return(
        <View style={styles.restaurant}>
            <TouchableOpacity
                onPress={() =>navigation.navigate("restaurants", {
                    screen: "restaurant",
                    params: { id, name }
                })}
            >
                <Image
                    resizeMode={"cover"}
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={{ uri: images[0] }}                 //Mostramos la imagen principal de restaurante
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorite}
                        underlayColor="transparent"            //Color de fondo
                        onPress={confirmRemoveFavorite}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

function NotFoundRestaurants(){
    return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize:20, fontWeight: "bold"}}>
                Aún no tienes restaurantes favoritos.
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }){
    return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize:20, fontWeight: "bold"}}>
                Necesitas estar logueado para ver los favoritos.
            </Text>
            <Button
                title="Ir al login"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#713853"}}
                onPress={()=> navigation.navigate("account", { screen: "login"})}   // Manera en como podemos hacer que navegue directamente a una de las pantallas dentro del stack
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurant: {
        marginVertical: 10
    },
    restaurant: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",   //Para que el titulo y el icono se repartan el espacio
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -30,                     //Se sube unos pixeles dentro de la imagen
        backgroundColor: "#fff"
    },
    name: {
        fontWeight: "bold",
        fontSize: 20
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100

    }
})
