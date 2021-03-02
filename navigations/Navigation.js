import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import RestaurantsStack from './RestaurantsStack'
import FavoritesStack from './FavoritesStack'
import TopRestaurantsStack from './TopRestaurantsStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'

const Tab = createBottomTabNavigator()

export default function Navigation() {

    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "restaurants":
                iconName = "compass-outline"
                break;
            case "favorites":
                iconName = "heart-outline"
                break;
            case "top-restaurants":
                iconName = "star-outline"
                break;
            case "search":
                iconName = "magnify"
                break;
            case "account":
                iconName = "home-outline"
                break;

        }

        return (
            <Icon
                type="material-community"
                name={iconName}
                size={22}
                color={color}
            />
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="restaurants" //Espicifo por cual de los route empezar, al cargar la pantalla es la opcion que estara activa
                tabBarOptions={{
                    inactiveTintColor: "#713853", // Defino el color para el icono activo e inactivo
                    activeTintColor: "#c42434",
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon : ({ color }) => screenOptions(route, color) //Hacemos el llamado de nuestra funcion para asignarle los iconos a nuestras opciones
                })}
            >
                <Tab.Screen
                    name="restaurants"   // para reconocer
                    component={RestaurantsStack}
                    options={{ title: "Restaurantes" }} // que objeto voy a renderizar
                />
                <Tab.Screen
                    name="favorites"   
                    component={FavoritesStack}
                    options={{ title: "Favoritos"}} 
                />
                <Tab.Screen
                    name="top-restaurants"   
                    component={TopRestaurantsStack}
                    options={{ title: "Top 5"}} 
                />
                <Tab.Screen
                    name="search"   
                    component={SearchStack}
                    options={{ title: "Buscar"}} 
                />
                <Tab.Screen
                    name="account"   
                    component={AccountStack}
                    options={{ title: "Cuenta"}} 
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
