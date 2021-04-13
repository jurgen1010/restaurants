import React from 'react'
import { Image } from 'react-native'
import { ActivityIndicator,StyleSheet, Text, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { size } from 'lodash'

export default function CarouselImage({ images, height, width, activeSlide, setActiveSlide }) {
    
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
        <View>
            <Carousel
                layout={"default"}
                data={images}
                sliderWidth={width}
                itemWidth={width}
                itemHeight={height}
                renderItem={renderItem}
                onSnapToItem={(index) => setActiveSlide(index)}            //Va tomar el index del punto que tomaron, al cambiar de imagen ira colocando como activa la imagen que estoy viendo

            />
            <MyPagintion data= {images} activeSlide={activeSlide}/>
        </View>
    )
}

function MyPagintion({ data, activeSlide }){
    return(
        <Pagination
            dotsLength={size(data)}                 //Cantidad de puntos
            activeDotIndex={activeSlide}            //Cual es el punto que estara resaltado
            containerStyle={styles.containerPagination}
            dotStyle={styles.dotActive}
            inactiveDotStyle={styles.dotInactive}
            inactiveDotOpacity={0.6} 
            inactiveDotScale={0.6}                  //Es para que se vea un poco mas pequeño el punto inactivo
        />
    )
}

const styles = StyleSheet.create({
    containerPagination:{
        backgroundColor: "transparent",
        zIndex: 1,                  //Para que quede en la parte de arriba
        position: "absolute",
        bottom: 0,                  //Para que se pegue abajo
        alignSelf: "center"
    },
    dotActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 2,
        backgroundColor: "#713853"
    },
    dotInactive: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginHorizontal: 2,
        backgroundColor: "#fff"
    }
})
