import React from 'react'
import { StyleSheet, Text,  ScrollView, Image } from 'react-native'
import { Button } from 'react-native-elements'

export default function UserGuest() {
    return (
        <ScrollView
            centerContent
            style={styles.viewBoddy}
        >
            <Image
                source={require("../../assets/Restaurant_logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil en Restaurants</Text>
            <Text style={styles.descripcion}>
                ¿Como describirías tu mejor restaurante? Busca y visualiza los mejores restaurantes de una forma sencilla, vota cuál te ha gustado más y comenta cómo ha sido tu experiencia.
            </Text>
            <Button
                buttonStyle={styles.button}
                title = "Ver tu perfil"
                onPress={()=> console.log("Click!!!")}
            ></Button>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBoddy: {
        marginHorizontal: 30
    },
    image: {
        height: 250,
        width: "100%",
        marginBottom: 10,
        textAlign: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginVertical: 10,
        textAlign: "center"
    },
    descripcion: {
        textAlign: "justify",
        marginBottom: 20,
        color: "#c42434"
    },
    button:{
        backgroundColor: "#713853"
    }
})
