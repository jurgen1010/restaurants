import React from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function Loading({ isVisible, text}) {  //Aplicamos concepto de destructuring del elemento 
    return (
        // componente para dar estilo a nuestri activity indicator al momento de abrir la app
        <Overlay                
            isVisible= {isVisible}
            windowBackgroundColor = "rgba(0,0,0,0.5)"   
            overlayBackgroundColor = "transparent"
            overlayStyle = {styles.overlay}
        >
            <View style={styles.view}>
                <ActivityIndicator
                    size="large"
                    color="#cb1d6c"
                />
                {
                    text && <Text style={styles.text}>{text}</Text>
                }
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay :{
        height : 100,
        width: 200,
        backgroundColor : "#fff",
        borderColor: "#cb1d6c",
        borderWidth: 2,
        borderRadius: 10
    },

    view :{
        flex: 1,
        alignItems: "center", //centrar horizontalmente
        justifyContent: "center" //centrar verticalmente
    },
    text:{
        color: "#cb1d6c",
        marginTop: 10
    }
})
