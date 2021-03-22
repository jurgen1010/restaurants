import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    
    const addRestaurant = () =>{
        console.log(formData)
        console.log("Fuck Yeahh !!")
    }

    return (
        <View style={styles.viewContainer}>
            <FormAdd
                formData={formData}                    //Le pasamos el elemento 
                setFormData={setFormData}              //Le pasamos la propiedad tambien para que el pueda setear los datos 
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
            />                   
            <Button
                title="Crear Restaurante."
                onPress={addRestaurant}                 //Cuando el onPress no lleva parametros me ahorro la funcion tipo flecha
                buttonStyle={styles.btnAddRestaurant}
            />
        </View>
    )
}

function FormAdd({ formData, setFormData, errorName, errorDescription, errorEmail, errorAddress, errorPhone }){              //Todos los componentes por obligacion deben comentar por mayuscula
    const [country, setCountry] = useState("CO")           //Por defecto Colombia cog interacional de dos digitos
    const [callingCode, setCallingCode] = useState("57")   //Codigo de llamada
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return(                   //Nos retornara una vista este componente
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante..."
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}    //Le entregamos evento (e) y con ese evento vamos a usar nuestra funcion onChange que usa el evento para tomar el texto y adicional le pasamos la el nombre de la propiedad a guardar
                errorMessage={errorName}
            />
            <Input
                placeholder="Dirección del restaurante..."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}    
                errorMessage={errorAddress}
            />
            <Input
                keyboardType="email-address"
                placeholder="Email del restaurante..."
                defaultValue={formData.email}
                onChange={(e) => onChange(e, "email")}    
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                    <CountryPicker
                        withFlag                           //No mostrara la bandera del pais
                        withCallingCode                    //El codigo de llamada del pais  
                        withFilter                         //Nos permitira filtrar el pais que necesitamos 
                        withCallingCodeButton              //Nos mostrarar el boton del codigo de llamada 
                        containerStyle={styles.countryPicker}
                        countryCode={country}
                        onSelect={(country) =>{                     //Nos retornara un objeto llamado country que es el que contiene el codigo del pais y el codigo internacional
                            setFormData({
                                ... formData, 
                                "country": country.cca2, 
                                "callingCode": country.callingCode[0] 
                            })
                            setCountry(country.cca2)                //La propiedad cca2 condigo internacional del pais de dos caracteres  
                            setCallingCode(country.callingCode[0])  //la propiedad callingCode es un arreglo porque los paises pueden tener varios codigos, pero por defecto tomamos el primero.
                        }}
                    />
                    <Input
                        placeholder="WhatsApp del restaurante..."
                        keyboardType="phone-pad"
                        containerStyle={styles.inputPhone}
                        defaultValue={formData.phone}
                        onChange={(e) => onChange(e, "phone")}    
                        errorMessage={errorPhone}
                    />
            </View>
            <Input
                placeholder="Descripción del restaurante..."
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
            />
        </View>
    )
}

const defaultFormValues = () =>{
    return {
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        country: "CO",
        callingCode: "57"
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height:"100%"
    },
    viewForm: {
        marginHorizontal: 10
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"   //Orientacion que le puedo definir a esa View
    },
    inputPhone: {
        width: "80%"
    },
    btnAddRestaurant: {
        margin: 20,
        backgroundColor: "#713853"

    }
})
