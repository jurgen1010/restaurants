import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)     //State para controlar si se muestra o no la contraseña al hacer presion sobre el icono eye-outline
    const [formData, setFormData] = useState(defaultFormValues())

    const onChange = (e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text})  //Hago que mi type sea dinamico con [type]
    }

    return (
        <View style={styles.form}>
            <Input
                containerStyle={styles.input}                  //Agreamos un evento al ingresar el password con el onChange
                placeholder="Ingresa tu email..."
                onChange={(e) => onChange(e, "email")}         //Llamamos a nuestra funcion onChange para ir  almacenados sus valores de manera dinamica
                keyboardType="email-address"
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                onChange={(e) => onChange(e, "password")}
                password ={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"} // Dependiendo del valor statePassword vamos alterar los inconos en pantalla
                        iconStyle={styles.icon}
                        onPress= {() => setShowPassword(!showPassword)}         //De esta manera al presionar alternaremos el estado del campo para mostror o no la contraeña al valor contrario de visualizacion
                    />
                }
            />
            <Input
                containerStyle={styles.input}
                placeholder="Confirma tu contraseña..."
                onChange={(e) => onChange(e, "confirm")}
                password ={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"} // Dependiendo del valor statePassword vamos alterar los inconos en pantalla
                        iconStyle={styles.icon}
                        onPress= {() => setShowPassword(!showPassword)}         //De esta manera al presionar alternaremos el estado del campo para mostror o no la contraeña al valor contrario de visualizacion
                    />
                }    
            />
            <Button
                title="Registrar Nuevo Usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress ={() =>console.log(formData)}
            />
        </View>
    )
}

const defaultFormValues = () => {                           // inicializamos nuestro state formData en vacio a traves de esta funcio tipo flecha
    return {
        email : "",
        password : "",
        confirm : ""
    }
}

const styles = StyleSheet.create({
    form: {
        marginTop:30,

    },
    input: {
        width: "100%"
    },
    btnContainer:{
        marginTop: 20,
        width: "95%",
        alignSelf : "center"
    },
    btn:{
        backgroundColor: "#713853"
    },
    icon: {
        color: "#c1c1c1"     //Color opacidad

    }

})
