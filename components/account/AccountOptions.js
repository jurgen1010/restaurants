import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { map } from 'lodash';
import { Icon, ListItem } from 'react-native-elements';

export default function AccountOptions({ user , toastRef }) {
    const  menuOptions = generateOptions();


    return (
        <View>
            {
                map(menuOptions, (menu, index) =>(    //Usamos los parantesis => () porque hacemos un return implicito, no es con lista
                    <ListItem
                        key={index}
                        style={styles.menuItem}
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
        </View>
    )
}

function generateOptions() {
    return[
        {
            title: "Cambiar Nombres y Apellidos",
            inconNameLeft: "account-circle",
            iconnColorLeft: "#a7bfd3",
            inconNameRight: "chevron-right",
            iconnColorRight: "#a7bfd3"
        },{
            title: "Cambiar Email",
            inconNameLeft: "at",
            iconnColorLeft: "#a7bfd3",
            inconNameRight: "chevron-right",
            iconnColorRight: "#a7bfd3"
        },{
            title: "Cambiar Contraseña",
            inconNameLeft: "lock-reset",
            iconnColorLeft: "#a7bfd3",
            inconNameRight: "chevron-right",
            iconnColorRight: "#a7bfd3"
        },
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#a7bfd3"
    }
})
