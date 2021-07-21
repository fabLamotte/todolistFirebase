import React, {useContext} from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

import auth from '@react-native-firebase/auth'

import { UserContext } from '../context/UserContext'

const Deconnexion = () => {
    const user = useContext(UserContext)

    const disconnect = () => {
        auth()
        .signOut()
        .then(() => console.log('Utilisateur déconnecté'))
        user.setUser(null)
    }

    return (
        <TouchableOpacity style={styles.button} onPress={disconnect}>
            <Text style={styles.textButton}>Se déconnecter</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        height:50,
        width:'100%',
        backgroundColor:'#D44040',
        justifyContent:'center',
        alignItems:'center'
    },
    textButton:{
        color:'white',
        fontWeight:'bold'
    }
})

export default Deconnexion