import React, {useContext} from 'react'
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'

import auth from '@react-native-firebase/auth'

import { UserContext } from '../context/UserContext'

import Icon from 'react-native-vector-icons/Ionicons'

const Deconnexion = () => {
    const user = useContext(UserContext)

    const disconnect = () => {
        auth()
        .signOut()
        .then(() => console.log('Utilisateur déconnecté'))
        user.setUser(null)
    }

    const icon = Platform.OS === 'ios' ? "log-out-outline" : "log-out-sharp"

    return (
        <TouchableOpacity style={styles.button} onPress={disconnect}>
            <Text style={styles.icon}>Déconnexion</Text>
            <Icon name={icon} style={styles.icon} size={40} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        height:50,
        width:'100%',
        backgroundColor:'#F96B6B',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    },
    icon:{
        color:'white',
        fontWeight:'bold'
    }
})

export default Deconnexion