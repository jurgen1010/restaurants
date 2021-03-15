import React, {useState} from 'react'
import { StyleSheet,  View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty } from 'lodash'


import { validateEmail } from '../../utils/helpers'
import { reauthenticate, updateEmail } from '../../utils/actions'

export default function ChangeEmailForm({ email, setShowModal, toastRef, setReloadUser }) {
    const [newEmail, setNewEmail] = useState(email)
    const [password, setPassword] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorPassword, setErrorPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onsubmit = async() =>{
        if (!validateForm()) {
            return
        }

        setLoading(true)
        const resultreauthenticate = await reauthenticate(password)
        if (!resultreauthenticate.statusResponse) {
            setLoading(false)
            setErrorPassword("Contreseña incorrecta.")
            return
        }

        const resultUpdateEmail = await updateEmail(newEmail)
        setLoading(false)

        if (!resultUpdateEmail.statusResponse) {
            setErrorEmail("No se puede cambiar por este correo ya esta en uso por otro ususario.")
            return
        }

        setReloadUser(true)   //Cambiamos el estado ReloadUser para refrescar la informacion en pantalla
        toastRef.current.show("Se ha actualizado el email", 3000)  //Mostramos un toast indicando que se actualizaron los datos
        setShowModal(false)   //Finalmente cerramos el modal de manera automatica en caso de ser exitoso el cambio de nombres
    }


    const validateForm = () => {
        setErrorEmail(null)
        setErrorPassword(null)
        let isValid = true

        if(!validateEmail(newEmail)){ 
            setErrorEmail("Debes ingresar un email válido.")
            isValid = false
        }
        if(newEmail === email){
            setErrorEmail("Debes ingresar un email diferente al actual.")
            isValid = false
        }
        if(isEmpty(password)){
            setErrorPassword("Debes ingresar tu contaseña.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa el nuevo correo..."
                containerStyle={styles.input}
                defaultValue={email}
                keyboardType = "email-address"
                onChange={(e) =>setNewEmail(e.nativeEvent.text)}   //De esta manera obtenemos lo que el usuario nos digite en el Input
                errorMessage={errorEmail}
                rightIcon={{  // {{ }} Por que es un objeto
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
            />
            <Input
                placeholder="Ingresa tu contraseña..."
                containerStyle={styles.input}
                defaultValue={password}
                onChange={(e) =>setPassword(e.nativeEvent.text)}   //De esta manera obtenemos lo que el usuario nos digite en el Input
                errorMessage={errorPassword}
                password = {true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline" }
                        iconStyle={{ color: "#c2c2c2" }}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Cambiar Email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onsubmit}
                loading={loading}     //Propiedad que trae el boton para simular un estado de procesamiento
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingVertical: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        width: "95%"
    },
    btn: {
        backgroundColor: "#713853"
    }
})
