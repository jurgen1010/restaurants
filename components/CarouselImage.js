import React from 'react'
import { Image } from 'react-native'
import { ActivityIndicator,StyleSheet, Text, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'

export default function CarouselImage({ images, height, width }) {
    
    const renderItem = ({ item })=>{  //Siempre que se use el renderItem usamos destructuring para poder que nos funcione
        return(
            <Image
                style={{ width, height }}
                PlaceholderContent={<ActivityIndicator color="#fff"/>}
                source={{ uri: item }}
            />
        )
    }

    return (
        <Carousel
            layout={"default"}
            data={images}
            sliderWidth={width}
            itemWidth={width}
            itemHeight={height}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({})
