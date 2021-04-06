import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListRestaurants({ restaurants, navigation }) {
    return (
        <View>
            <FlatList
                data={restaurants}
                keyExtractor={(item, index) => index.toString() }
                renderItem={(restaurant) => (                                        //Como tiene un retorno interno usamos los ( )
                    <Restaurant restaurant={restaurant} navigation={navigation}/>
                )}  
            />
        </View>
    )
}

function Restaurant({ restaurant, navigation }){
    const { id, images, name, address, description, phone, callingCode} = restaurant.item                                    //La data del restaurant viene en una propiedad item cuando estamos usando un renderItem
    const imageRestaurant = images[0]

    return (                                                           //TouchableOpacity para poder tocar el restaurante e ir al detalle del restaurante
        <TouchableOpacity>                                           
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
                    <Text style= {styles.restaurantTitle}>{name}</Text>
                    <Text style= {styles.restaurantInformation}>{address}</Text>
                    <Text style= {styles.restaurantInformation}>+{callingCode}-{phone}</Text>
                    <Text style= {styles.restaurantDescription}>
                        {
                            size (description) >0
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
