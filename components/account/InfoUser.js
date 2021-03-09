import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'

export default function InfoUser({ user }) {    //Hacemos detructuring del parametro enviado por props desde UserLogged
    console.log(user)
    return (
        <View style={styles.container}>
            <Avatar
                rounded // Redondear es equivalante rounded = {true}
                size="large"
                containerStyle={styles.avatar}
                source={
                    user.photoURL
                    ? {uri: photoURL}
                    : require("../../assets/default-avatar-profile.jpg")
                } 
            />
            <View style= {styles.infoUser}> 
                <Text style={styles.displayName}>
                    {
                        user.displayName ? user.displayName : "Anónimo" //SI el user tiene display name lo mostramos sino mostraremos la palabra Anónimo
                    }
                </Text>
                <Text>{user.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",   //Apilaremos los items de manera horizontal 
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infoUser: {
        marginLeft: 20
    },
    displayName: {
        fontWeight : "bold",
        paddingBottom: 5
    }
})
