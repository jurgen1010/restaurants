import React, {useRef, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../../components/Loading'

import AddRestaurantForm from '../../components/restaurants/AddRestaurantForm'

export default function AddRestaurant({ navigation }) {   //Podemos hacer destructuring al objecto navigation porque esta metido en stack
    const toastRef = useRef()   
    const [loading, setLoading] = useState(false)

    return (                                              //Llamamos a nuestro formulario de adicion de restaurantes
        <KeyboardAwareScrollView>
            <AddRestaurantForm 
                toastRef={toastRef} 
                setLoading={setLoading}
                navigation={navigation}
            />  
            <Loading isVisible={loading} text="Creando restaurante..."/>   
            <Toast ref={toastRef} position="center" opacity={0.9}/> 
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})
