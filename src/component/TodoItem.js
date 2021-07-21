import React, {useState} from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const TodoItem = ({item}) => {

    const icon = Platform.OS === 'ios'? "checkmark-circle-outline" : "checkmark-circle-sharp"
    const [checked, isChecked] = useState(item.complete ?  true : false)

    const completeTodo = () => {
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.block}>
                <Text>{item.name}</Text>
                <Icon name="checkmark-circle-outline" style={{color: checked ? 'green' : 'grey'}} size={20} onPress={completeTodo} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:50,
        paddingHorizontal:20
    },
    block:{
        borderWidth:1,
        borderColor:'#CFCFCF',
        borderRadius:10,
        padding:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
})

export default TodoItem