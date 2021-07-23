import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

// Component
import Deconnexion from './../component/Deconnexion'
import TodoItem from '../component/TodoItem'

// BDD
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

// Gestion formulaire
import { Formik, setNestedObjectValues } from 'formik'
import * as yup from 'yup'

const NewTaskValidationSchema = yup.object().shape({
    name: yup
        .string()
        .required('Veuillez donner un nom à votre tâche')
})

const TodoList = () => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const userUid = auth().currentUser.uid

    // Fonction d'ajout d'une tâche
    const AddTodo = (values) => {
        var higherId = 0
        data.forEach((element, index) => {
            if(higherId <= element.id){
                higherId = element.id
            }
        })
        // Insertion de la nouvelle tâche
        firestore().collection('users').doc(userUid).update({
            task: firestore.FieldValue.arrayUnion({
                id: data.lengh === 0 ? 0 : higherId+1,
                name:values.name,
                complete:false
            })
        })
        values.name = ""
        // Rafraîchissement de la liste
        setIsLoading(true)
    }
 
    // Chargement des tâches au chargement de la page
    useEffect(() => {
        if(isLoading){
            firestore().collection('users').doc(userUid).get()
            .then((doc) => {
                setData(doc.data().task)
            })
            setIsLoading(false)
        }
    }, [isLoading])

    return (
        <View style={styles.container}>
            <View>
                <Formik
                    initialValues={{ name: '' }}
                    onSubmit={values => AddTodo(values)}
                    validationSchema={NewTaskValidationSchema}>

                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View style={styles.containerForm}>
                            <View style={styles.form}>
                                <View style={styles.blockInput}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                        placeholder="Nom de la tâche"
                                    />
                                </View>
                                <View style={styles.submitView}>
                                    <TouchableOpacity onPress={() => {
                                        handleSubmit();
                                    }} style={styles.button}>
                                        <Text style={styles.buttonText}>Ajouter</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                { (errors.name)? <Text style={{ color: 'white', backgroundColor:'#E7AA48', width:'100%', textAlign:'center' }}>{errors.name}</Text> : null }
                            </View>
                        </View>
                    )}

                </Formik>
                <View style={styles.list}>
                    {
                        data.length > 0? 
                            <FlatList 
                                data={data}
                                renderItem={(item) => 
                                    <TodoItem 
                                        item={item.item} 
                                        data={data} 
                                        setData={setData} 
                                        firestore={firestore} 
                                        userUid={userUid} 
                                    />
                                }
                                keyExtractor={item => item.id}
                            />
                        : 
                        <Text style={styles.noData}>Aucune tâche ajoutée pour le moment</Text>
                    }
                </View>
            </View>
            <Deconnexion />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-between',
    },
    containerForm:{
        margin:15,
        borderColor:'#D3D3D3',
        borderWidth:1,
        borderRadius:20,
        overflow:'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    noData:{
        textAlign:'center'
    },
    title:{
        textAlign:'center',
        fontWeight:'bold',
        fontSize:25,
        fontStyle:'italic',
        color:'#938C8C'
    },
    submitView: {
        height:50,
        width:'20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6484BD',
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    input:{
        height:50,
        paddingLeft:20,
        justifyContent:'center',
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
        height:50,
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    blockInput:{
        height:'100%',
        width:'80%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    red:{
        color:'red',
        textAlign:'center'
    },
    list:{
        marginTop:20
    }
})

export default TodoList