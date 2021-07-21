import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'

// BDD
import auth from '@react-native-firebase/auth'

// Gestion formulaire
import { Formik } from 'formik'
import * as yup from 'yup'

// Context 
import { UserContext } from '../context/UserContext'

const loginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Email non valide")
        .required('Adresse email requise'),
    password: yup
        .string()
        .required('Mot de passe requis'),
})

const Connexion = (props) => {
    const{
        initialized,
        setInitialized,
        user,
        setUser
    } = props

    const [errorForm, setErrorForm] = useState("")

    function onAuthStateChanged(user) {
        setUser(user);
        if (initialized) setInitialized(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    const AddUser = async(values) => {
        auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(() => {
            console.log('Utilisateur connecté !')
        })
        .catch(error => {
            if (error.code === 'auth/wrong-password') {
                setErrorForm('Mot de passe incorrect !')
            }

            if (error.code === 'auth/user-not-found') {
                setErrorForm('Adresse email inconnue !')
            }
        })
    }

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={values => AddUser(values)}
                validationSchema={loginValidationSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.container}>
                        <Text style={styles.title}>Connexion</Text>
                        <View style={styles.form}>
                            <View style={styles.blockInput}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder="Adresse mail"
                                />
                                {(errors.email && touched.email) &&
                                    <Text style={{ color: 'red' }}>{errors.email}</Text>
                                }
                            </View>
                            <View style={styles.blockInput}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    placeholder="Entrez votre mot de passe"
                                    secureTextEntry
                                />
                                {(errors.password && touched.password) &&
                                    <Text style={{ color: 'red' }}>{errors.password}</Text>
                                }
                            </View>
                            {errorForm? <Text style={styles.red}>{errorForm}</Text> : null}
                            <View style={styles.submitView}>
                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                    <Text style={styles.buttonText}>Se connecter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%'
    },
    submitView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:20
    },
    button: {
        backgroundColor: 'blue',
        height: 50,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    input:{
        margin:1,
        padding:5
    },
    title:{
        color:'grey',
        fontSize:30,
        marginVertical:20
    },
    form:{
        width:'100%'
    },
    blockInput:{
        borderBottomColor:'black',
        borderBottomWidth:1
    },
    red:{
        color:'red',
        textAlign:'center'
    }
})

export default Connexion