import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import { Image } from 'react-native-elements'
import { formatPhone } from '../../utils/helpers'


export default function ListRestaurants({ restaurants, navigation, handleLoadMore }) {
    return (                                
        <View>
            <FlatList
                data={restaurants}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(restaurant) => (                                      //Como tiene un retorno interno usamos los ( )
                    <Restaurant restaurant={restaurant} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Restaurant({ restaurant, navigation }){
    const { id, images, name, address, description, phone, callingCode} = restaurant.item                                    //La data del restaurant viene en una propiedad item cuando estamos usando un renderItem
    const imageRestaurant = images[0]

    const goRestaurant = () => {
        navigation.navigate("restaurant", { id, name })                                     //El elemento que declaramos en en RestaurantStack y le pasamos parametros a la navegacion id, name del restaurante
    }

    return (                                                                  //TouchableOpacity para poder tocar el restaurante e ir al detalle del restaurante
        <TouchableOpacity onPress={goRestaurant}>                                           
            <View style={styles.viewRestaurant}>   
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode="cover"                         
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source= {{ uri: imageRestaurant }}                   //Como es un objeto se coloca en doble llave
                        style= {styles.imageRestaurant}
                    />
                </View>                      
                <View>
                <Text style={styles.restaurantTitle}>{name}</Text>
                    <Text style={styles.restaurantInformation}>{address}</Text>
                    <Text style={styles.restaurantInformation}>{formatPhone(callingCode, phone)}</Text>
                    <Text style={styles.restaurantDescription}>
                        {
                            size(description)>0
                                ? `${description.substr(0, 60)}...`         //Usamos el template srtring para solo mostrar una pequeña parte de la descripcion
                                : description
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    viewRestaurant: {
        flexDirection : "row",
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15

    },
    imageRestaurant: {
        width: 90,
        height: 90
    },
    restaurantTitle: {
        fontWeight: "bold"
    },
    restaurantInformation: {
        paddingTop: 2,
        color: "grey"
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    }
})
