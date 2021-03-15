import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash';
import { Icon, ListItem } from 'react-native-elements';

import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';

export default function AccountOptions({ user , toastRef, setReloadUser }) {

    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const generateOptions = () => {
        return[
            {
                title: "Cambiar Nombres y Apellidos",
                inconNameLeft: "account-circle",
                iconnColorLeft: "#a7bfd3",
                inconNameRight: "chevron-right",
                iconnColorRight: "#a7bfd3",
                onPress: ()=> selectedComponent("displayName")  //Funcion tipo flecha para manejar el evento onPress de cada opcion 
            },{
                title: "Cambiar Email",
                inconNameLeft: "at",
                iconnColorLeft: "#a7bfd3",
                inconNameRight: "chevron-right",
                iconnColorRight: "#a7bfd3",
                onPress: ()=> selectedComponent("email")
            },{
                title: "Cambiar Contraseña",
                inconNameLeft: "lock-reset",
                iconnColorLeft: "#a7bfd3",
                inconNameRight: "chevron-right",
                iconnColorRight: "#a7bfd3",
                onPress: ()=> selectedComponent("password")
    
            },
        ]
    }

    const selectedComponent = (key) =>{
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={user.displayName}      //Le enviamos estas props para que ChangeDisplayNameForm pueda pintar el form de cambiar displayName
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUser={setReloadUser}  //Al mismo modo le enviamos el param de status setReloadUser para estar refrescando la pantalla y poder visualizar los cambios
                    />
                )
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={user.email}     
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUser={setReloadUser}
                    />
                )
                break;
            case "password":
                setRenderComponent(
                    <Text>password</Text>
                )
                break;
        }
        setShowModal(true)
    }

    const  menuOptions = generateOptions()  //Para poder compilar mis opciones de menu

    return (
        <View>
            {
                map(menuOptions, (menu, index) =>(    //Usamos los parantesis => () porque hacemos un return implicito, no es con lista
                    <ListItem
                        key={index}
                        style={styles.menuItem}
                        onPress={menu.onPress}        //Hacemos llamado de la funcion tipo flecha declarada en nuestra funcion generateOptions
                    >
                        <Icon
                            type="material-community"
                            name={menu.inconNameLeft}
                            color={menu.iconnColorLeft}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.inconNameRight}
                            color={menu.iconnColorRight}
                        />
                    </ListItem>
                ))
            }
            <Modal isVisible={showModal} setVisible={setShowModal}>
                {
                    renderComponent    //renderComponent va contener todo el estado que yo cargue en la funcion selectedComponent de manera dinamica
                }
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#a7bfd3"
    }
})
