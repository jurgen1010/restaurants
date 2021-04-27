import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Restaurants from '../screens/restaurants/Restaurants'
import AddRestaurant from '../screens/restaurants/AddRestaurant'
import Restaurant from '../screens/restaurants/Restaurant'
import AddReviewRestaurant from '../screens/restaurants/AddReviewRestaurant'
import Login from '../screens/account/Login'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options = {{ title : "Restaurantes" }}
            />
            <Stack.Screen
                name="add-restaurants"
                component={AddRestaurant}
                options = {{ title : "Crear Restaurante" }}
            />
            <Stack.Screen
                name="restaurant"
                component={Restaurant}
            />
            <Stack.Screen
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{ title : "Nuevo comentario" }}
            />
            <Stack.Screen   //Adicionamos un stack screen para poder ir a la pantalla de Login
                name="login"
                component={Login}
                options = {{ title : "Iniciar Sesión" }}
            />
        </Stack.Navigator>
    )
}
