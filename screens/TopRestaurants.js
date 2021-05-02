import React, { useState,  useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'

import { getTopRestaurants } from '../utils/actions'
import Loading from '../components/Loading'
import ListTopRestaurant from '../components/ranking/ListTopRestaurant'

export default function TopRestaurants({ navigation }) {
    const [restaurants, setRestaurants] = useState(null)
    const [loading, setLoading] = useState(false)

    console.log(restaurants)

    useFocusEffect(
        useCallback(() => {
            async function getData(){
                setLoading(true)
                const response = await getTopRestaurants(10)
                if (response.statusResponse) {
                    setRestaurants(response.restaurants)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )
    return (
        <View>
            <ListTopRestaurant
                restaurants={restaurants}
                navigation={navigation}
            />
            <Loading isVisible={loading} text={"Por favor espere..."}/>
        </View>
    )
}

const styles = StyleSheet.create({})
