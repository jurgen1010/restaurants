import React, {useState} from 'react'
import { StyleSheet,  View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, size } from 'lodash'


import { validateEmail } from '../../utils/helpers'
import { reauthenticate, updateEmail } from '../../utils/actions'


export default function ChangePasswordForm({ setShowModal, toastRef }) {
    const [newPassword, setNewPassword] = useState(null)
    const [currentPassword, setCurrentPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [errorNewPassword, setErrorNewPassword] = useState(null)
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onsubmit = async() =>{
        if (!validateForm()) {
            return
        }

        // setLoading(true)
        // const resultreauthenticate = await reauthenticate(password)
        // if (!resultreauthenticate.statusResponse) {
        //     setLoading(false)
        //     setErrorPassword("Contreseña incorrecta.")
        //     return
        // }

        // const resultUpdateEmail = await updateEmail(newEmail)
        // setLoading(false)

        // if (!resultUpdateEmail.statusResponse) {
        //     setErrorEmail("No se puede cambiar por este correo ya esta en uso por otro ususario.")
        //     return
        // }

        // setReloadUser(true)   //Cambiamos el estado ReloadUser para refrescar la informacion en pantalla
        // toastRef.current.show("Se ha actualizado el email", 3000)  //Mostramos un toast indicando que se actualizaron los datos
        // setShowModal(false)   //Finalmente cerramos el modal de manera automatica en caso de ser exitoso el cambio de nombres
    }


    const validateForm = () => {
        setErrorNewPassword(null)
        setErrorCurrentPassword(null)
        setErrorConfirmPassword(null)
        let isValid = true

       
        if(isEmpty(currentPassword)){
            setErrorCurrentPassword("Debes ingresar tu contaseña actual.")
            isValid = false
        }
        if(size(newPassword) < 6){
            setErrorNewPassword("Debes ingresar una nueva contaseña de al menos 6 carácteres.")
            isValid = false
        }
        if(size(confirmPassword) < 6){
            setErrorConfirmPassword("Debes ingresar una confirmación de tu contraseña de al menos 6 carácteres.")
            isValid = false
        }
        if(newPassword !== confirmPassword){
            setErrorNewPassword("La nueva contraseña y la confirmación no son iguales.")
            setErrorConfirmPassword("La nueva contraseña y la confirmación no son iguales.")
            isValid = false
        }
        if(newPassword === currentPassword){
            setErrorCurrentPassword("Debes ingresar una contraseña diferente al actual.")
            setErrorNewPassword("Debes ingresar una contraseña diferente al actual.")
            setErrorConfirmPassword("Debes ingresar una contraseña diferente al actual.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa tu contraseña actual..."
                containerStyle={styles.input}
                defaultValue={currentPassword}
                onChange={(e) =>setCurrentPassword(e.nativeEvent.text)}   //De esta manera obtenemos lo que el usuario nos digite en el Input
                errorMessage={errorCurrentPassword}
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
            <Input
                placeholder="Ingresa tu nueva contraseña..."
                containerStyle={styles.input}
                defaultValue={newPassword}
                onChange={(e) =>setNewPassword(e.nativeEvent.text)}   //De esta manera obtenemos lo que el usuario nos digite en el Input
                errorMessage={errorNewPassword}
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
            <Input
                placeholder="Ingresa tu confirmación de nueva contraseña..."
                containerStyle={styles.input}
                defaultValue={confirmPassword}
                onChange={(e) =>setConfirmPassword(e.nativeEvent.text)}   //De esta manera obtenemos lo que el usuario nos digite en el Input
                errorMessage={errorConfirmPassword}
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
                title="Cambiar Contraseña"
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
