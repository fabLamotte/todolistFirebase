import React, {useState, useRef} from 'react'
import { View, Text, Animated, Platform, TouchableOpacity, PanResponder, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'


const TodoItem = (props) => {
    const {item, data, setData, firestore, userUid} = props
    const icon = Platform.OS === 'ios'? "checkmark-circle-outline" : "checkmark-circle-sharp"
    const [checked,setChecked] = useState(item.complete ? true : false)
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            pan.setOffset({
              x: pan.x._value,
            });
          },
          onPanResponderMove: Animated.event(
            [
              null,
              { dx: pan.x }
            ], {useNativeDriver:true}
          ),
        onPanResponderRelease: (e, gesture) => {
            Animated.spring(pan, {
                toValue: { x: 0 },
            }).start();
          }
        })
      ).current;
    
    // Fonction de changement de status complete
    const completeTodo = (idItem) => {
        var list = data
        if(list[idItem].complete){

            list[idItem].complete = false
            setChecked(false)

        } else {
            list[idItem].complete = true
            setChecked(true)
        }

        setData(list)

        firestore().collection('users').doc(userUid).update({
            task: data
        })
        .then((response) => console.log("success"))
        .catch((error) => console.log(error))
    }

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[pan.getLayout()]}
        >
            <TouchableOpacity style={{
                backgroundColor: item.complete ? 'green' : 'white', 
                borderRadius:10,
                borderWidth:1,
                padding:10,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                borderColor:'#CFCFCF',
                height:50,
                marginHorizontal:20,
                marginVertical:2
            }} onPress={() => completeTodo(item.id)}>
                <Text style={{color: item.complete ? 'white' : 'grey'}}>{item.name}</Text>
                <Icon name={icon} style={{color: item.complete ? 'white' : 'grey'}} size={20} />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default TodoItem