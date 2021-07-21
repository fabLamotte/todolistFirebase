import React, {useState, useContext} from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'

// Gestion du formulaire 
import { Formik } from 'formik'
import * as yup from 'yup'

// BDD
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const NewTaskValidationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Veuillez donner un nom à votre tâche'),
    description: yup
        .string()
        .required('Une petite description est demandée'),
})

const AjoutToDoList = (props) => {
    const{
        navigation
    } = props
    const [data, setData] = useState([])
    
    const user = auth().currentUser
    console.log(user)

    const AddTodo = (values) => {
        firestore().collection("users").doc("todos").add({
            name: values.name,
            description: values.description,
            complete: false
        })
        .then(() => {
            navigation.navigate("TodoList")
        })
        .catch((error) => {
            console.error("Erreur lors de l'enregistrement de la tâche: ", error);
        });
    }

    return (
        <Formik
            initialValues={{ name: '', description: '' }}
            onSubmit={values => AddTodo(values)}
            validationSchema={NewTaskValidationSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={styles.title}>Nouvelle tâche</Text>
                    <View style={styles.form}>
                        <View style={styles.blockInput}>
                            <TextInput
                            style={styles.input}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                placeholder="Nom de la tâche"
                            />
                            {(errors.name && touched.name) &&
                                <Text style={{ color: 'red' }}>{errors.name}</Text>
                            }
                        </View>
                        <View style={styles.blockInput}>
                            <TextInput
                                style={styles.textarea}
                                onChangeText={handleChange('description')}
                                onBlur={handleBlur('description')}
                                value={values.description}
                                placeholder="Ajoutez une description à votre tâche"
                                multiline = {true}
                                numberOfLines = {4}
                                maxLength={240}
                            />
                            {(errors.description && touched.description) &&
                                <Text style={{ color: 'red' }}>{errors.description}</Text>
                            }
                        </View>
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
        padding:5,
    },
    textarea:{
        borderWidth:1,
        borderColor:'#CFCFCF',
    },
    title:{
        color:'grey',
        fontSize:30,
        marginVertical:20
    },
    form:{
        width:'80%'
    },
    blockInput:{
        borderBottomColor:'black',
        borderBottomWidth:1,
        margin:1
    },
    red:{
        color:'red',
        textAlign:'center'
    }
})

export default AjoutToDoList