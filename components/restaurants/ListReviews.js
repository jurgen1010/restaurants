import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import  firebase  from 'firebase/app'
import { Button } from 'react-native-elements'

export default function ListReviews({ navigation, idRestaurant }) {

    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    return (
        <View>
            {
                userLogged ?(
                    <Button
                        buttonStyle={styles.btnAddReview}
                        title="Escribe una opinión"
                        titleStyle={styles.btnTitleAddReview}
                        onPress={() => navigation.navigate("add-review-restaurant", { idRestaurant: idRestaurant })}
                        icon={{
                            type: "material-community",
                            name: "square-edit-outline",
                            color: "#c42434"
                        }}
                    />
                ): (
                    <Text 
                        style={styles.mustLoginText}
                        onPress={() =>navigation.navigate("login")}
                    >
                        Para escribir una opinión es necesario estar logueado.{" "}
                        <Text style={styles.loginText}>
                            Pulsa AQUÍ para iniciar sesión.
                        </Text>
                    </Text>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#c42434"
    },
    mustLoginText: {
        textAlign: "center",
        color : "#c42434",
        padding: 20
    },
    loginText : {
        fontWeight : "bold"
    }
})
