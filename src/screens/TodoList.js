import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

// Component
import Deconnexion from './../component/Deconnexion'
import TodoItem from '../component/TodoItem'
// BDD
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const TodoList = () => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        if(isLoading){
            const userDocument = firestore().collection("todos").get().then((querySnapshot) => {
                let list = []
                let id = 0
                querySnapshot.forEach((doc) => {
                    list.push({
                        id:id,
                        ...doc.data()
                    })
                    id++
                });
                setData(list)
                console.log(list)
            });
            setIsLoading(false)
        }

    }, [isLoading])

    return (
        <View style={styles.container}>
            <Deconnexion />
            <View>
                <Text style={styles.title}>Votre todo Liste !!</Text>
            </View>
            {
                data.length > 0? 
                    <FlatList 
                        data={data}
                        renderItem={(item) => <TodoItem item={item.item} />}
                        keyExtractor={item => item.id}
                    />
                : 
                    <Text style={styles.noData}>Aucune tâche ajoutée pour le moment</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
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
    }
})

export default TodoList