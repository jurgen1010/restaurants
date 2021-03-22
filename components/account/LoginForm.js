import React, {useState} from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'

import { validateEmail } from '../../utils/helpers'
import Loading from '../Loading'
import { loginWithEmailAndPassword } from '../../utils/actions'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)     //State para controlar si se muestra o no la contraseña al hacer presion sobre el icono eye-outline
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) =>{
        setFormData({...formData, [type]: e.nativeEvent.text})  //Hago que mi type sea dinamico con [type]
    }

    const doLogin = async() =>{
        if (!validateData()) {
            return;
        }

        setLoading(true)
        const result = await loginWithEmailAndPassword(formData.email, formData.password)
        setLoading(false)

        if (!result.statusResponse) {
            setErrorEmail(result.error)
            setErrorPassword(result.error)
            return
        }

        navigation.navigate("account")
    }

    const validateData = () => {
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes de ingresar un email válido.")
            isValid = false
        }

        if (isEmpty(formData.password)) {
            setErrorPassword("Debes de ingresar tu contraseña.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.container}>
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
            <Button
                title="Iniciar Sesión"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress ={() => doLogin()}
            />
            <Loading
                isVisible={loading}
                text="Iniciando Sesión..."
            /> 
        </View>
    )
}

const defaultFormValues = () => {                           // inicializamos nuestro state formData en vacio a traves de esta funcio tipo flecha
    return {
        email : "",
        password : ""
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems : "center",
        justifyContent: "center",
        marginTop: 30
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