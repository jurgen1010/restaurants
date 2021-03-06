import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { size } from 'lodash'
import { useNavigation } from '@react-navigation/native'

import { validateEmail } from '../../utils/helpers'
import { registerUser } from '../../utils/actions'
import Loading from '../Loading'



export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)     //State para controlar si se muestra o no la contraseña al hacer presion sobre el icono eye-outline
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text})  //Hago que mi type sea dinamico con [type]
    }

    const doRegisterUser = async() => {
        if (!validateData()) {
            return;
        }

        setLoading(true)
        const result = await registerUser(formData.email, formData.password)
        setLoading(false)


        if (!result.statusResponse) {
           setErrorEmail(result.error) 
           return
        }

        navigation.navigate("account")
    }

    const validateData = () => {
        setErrorConfirm("")
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if (!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email válido.")
            isValid = false
        }

        if (size(formData.password) < 6) {
            setErrorPassword("Debes ingresar una constraseña del al menos 6 carácteres.")
            isValid = false 
        }

        if (size(formData.confirm) < 6) {
            setErrorConfirm("Debes ingresar una confirmación de contraseña de al menos 6 carácteres.")
            isValid = false 
        }

        if (formData.password !== formData.confirm) {
            setErrorPassword("La contraseña y la confirmación no son iguales.")
            setErrorConfirm("La contraseña y la confirmación no son iguales.")
            isValid = false 
        }

        return isValid
    }

    return (
        <View style={styles.form}>
            <Input
                containerStyle={styles.input}                  //Agreamos un evento al ingresar el password con el onChange
                placeholder="Ingresa tu email..."
                onChange={(e) => onChange(e, "email")}         //Llamamos a nuestra funcion onChange para ir  almacenados sus valores de manera dinamica
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                password ={true}
                onChange={(e) => onChange(e, "password")}
                secureTextEntry={!showPassword}
                errorMessage={errorPassword}
                defaultValue={formData.password}
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
                password ={true}
                onChange={(e) => onChange(e, "confirm")}
                secureTextEntry={!showPassword}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
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
                onPress ={() => doRegisterUser()}
            />
            <Loading
                isVisible={loading}
                text="Creando cuenta..."
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
