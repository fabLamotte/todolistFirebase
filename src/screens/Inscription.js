import React, {useState} from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native'

import { Formik } from 'formik'
import * as yup from 'yup'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const SignInValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Email non valide")
        .required('Adresse email requise'),
    password: yup
        .string()
        .min(8, ({ min }) => `Votre mot de passe doit faire au moins ${min} caractères`)
        .required('Mot de passe requis'),
    repeatedPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Les mots de passe ne sont pas identitque.')
        .required("Veuillez répéter votre mot de passe")
})

const Inscription = (props) => {
    const [errorForm, setErrorForm] = useState("")

    const AddUser = async(values) => {
        // Ajout d'un utilisateur
        const user = auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((response) => {
            // Ajout de l'utilisateur en base de données
            firestore().collection("users").doc(auth().currentUser.uid).set({
                email: response.user.email,
                task:[]
            })
            .then(() => {
            })
            .catch((error) => {
                console.error("Erreur lors de l'enregistrement de la tâche: ", error);
            })
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                setErrorForm('Cet email est déjà utilisé !')
            }

            if (error.code === 'auth/invalid-email') {
                setErrorForm('Adresse email invalide !')
            }

            setErrorForm(error)
        })

    }

    return (
        <Formik
            initialValues={{ email: '', password: '', repeatedPassword: '' }}
            onSubmit={values => AddUser(values)}
            validationSchema={SignInValidationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={styles.title}>Inscription</Text>
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
                                placeholder="Entrez un mot de passe"
                                secureTextEntry
                            />
                            {(errors.password && touched.password) &&
                                <Text style={{ color: 'red' }}>{errors.password}</Text>
                            }
                        </View>
                        <View style={styles.blockInput}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('repeatedPassword')}
                                onBlur={handleBlur('repeatedPassword')}
                                value={values.repeatedPassword}
                                placeholder="Répétez votre mot de passe"
                                secureTextEntry
                            />
                            {(errors.repeatedPassword && touched.repeatedPassword) &&
                                <Text style={{ color: 'red' }}>{errors.repeatedPassword}</Text>
                            }
                        </View>
                        {errorForm? <Text style={styles.red}>{errorForm}</Text> : null}
                        <View style={styles.submitView}>
                            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <Text style={styles.buttonText}>Valider l'inscription</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </Formik>
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

export default Inscription