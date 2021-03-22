import React, {useState, useEffect} from 'react'
import { StyleSheet, Dimensions, Text, View, ScrollView, Alert } from 'react-native'
import { Avatar, Button, Icon, Input, Image } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter } from "lodash";
import MapView from 'react-native-maps';

import  Modal  from "../../components/Modal";

import { getCurrentLocation, loadImageFromGallery } from '../../utils/helpers';

const widthScreen = Dimensions.get("window").width        //La forma en como obtengo las dimensiones de la pantalla

export default function AddRestaurantForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setiImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)
    
    const addRestaurant = () =>{
        console.log(formData)
        console.log("Fuck Yeahh !!")
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageRestaurant
                imageRestaurant={imagesSelected[0]}      //La primera imagen es la que le colocaremos a nuestro restaurante
            />
            <FormAdd
                formData={formData}                    //Le pasamos el elemento 
                setFormData={setFormData}              //Le pasamos la propiedad tambien para que el pueda setear los datos 
                errorName={errorName}
                errorDescription={errorDescription}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setiImagesSelected={setiImagesSelected}
            />                   
            <Button
                title="Crear Restaurante."
                onPress={addRestaurant}                 //Cuando el onPress no lleva parametros me ahorro la funcion tipo flecha
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapRestaurant ({ isVisibleMap, setIsVisibleMap, locationRestaurant, setLocationRestaurant, toastRef }){
    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
        (async() =>{                                                      //Para realizar un autollamado asincrono usamos los (async)()
            const response = await getCurrentLocation()
            if (response.status) {
                setNewRegion(response.location)
            }
        })()                                       
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return(
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) =>setNewRegion(region)}            //Cuando me cambien la location la guardaremos en el estado setLocationRestaurant
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable                             //El usuario podra cambiar la posicion del marcador
                            />
                        </MapView>
                    )
                }
                <View  style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}                                   //No hacemos () porque no estamos involucrando parametros
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={()=> setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageRestaurant({ imageRestaurant }){
    return(
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200}}                            //La forma en como puedo puedo definir el estilo de componente dentro del mismo.
                source={
                    imageRestaurant
                        ? { uri: imageRestaurant}
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage( { toastRef, imagesSelected, setiImagesSelected } ){  //Creamos un nuevo componente donde vamos a cargar la imagen de restaurante, siempre inicia por mayuscula
    
    const imageSelect = async() =>{                                        //Asincrono ya que toma un poco en cargar la imagen
        const response = await loadImageFromGallery([4, 3])                 //[4,3] es una relacion mas rectangular, horizontalmente sea un 25% mas largo que verticalmente
        if (!response.status) {
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
            return
        }

        setiImagesSelected([...imagesSelected, response.image])            //Finalmente guardamos la imagen seleccionada en el estado imagesSelected
    }

    const removeImage = (image) =>{
        Alert.alert(
            "Eliminar imagen",
            "¿estas seguro que deseas eliminar la imagén",
            [
                {
                    text: "No",
                    style: "cancel"

                },
                {
                    text:"Si",
                    onPress: ()=>{
                        setiImagesSelected(
                            filter(imagesSelected, (imgeUrl) =>imgeUrl !== image)   //por medio del metodo filter de lodash, guardamos en nuestro estado todas la imagenes menos la que seleccione a eliminar
                        )
                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return (                                                               //Cuando usar o no las corchetes { } (DUDA)
        <ScrollView
            horizontal                                                     //Para decirle a el scroll que se va comportar de forma horizontal
            style={styles.viewImage}
        >
            {
                size(imagesSelected) < 10 && (                             //Nos pintara el icono de imagenes si es menor a 10
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />                   
                )
            }
            {
                map(imagesSelected, (imageRestaurant, index) => (      //Usamos ( ) porque tenemo un retrono implicito        
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri : imageRestaurant }}
                        onPress={()=> removeImage(imageRestaurant)}
                    />
                ))
            }
        </ScrollView>
    )
}

function FormAdd({ 
    formData, 
    setFormData,
     errorName, 
     errorDescription, 
     errorEmail, 
     errorAddress, 
     errorPhone, 
     setIsVisibleMap, 
     locationRestaurant 
}){                                                         //Todos los componentes por obligacion deben comentar por mayuscula
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
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#713853" : "#c2c2c2",
                    onPress: ()=> setIsVisibleMap (true)
                }}
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

    },
    viewImage: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop:30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle:{
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 400
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#713853"
    },
    viewMapBtnSave: {
        backgroundColor: "#9cab3c"
    }
})
