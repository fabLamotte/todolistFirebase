import React, {useState, useRef} from 'react'
import { View, Text, Platform, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'


const TodoItem = (props) => {
    const {item, data, setData, firestore, userUid, setIsLoading} = props
    const icon = Platform.OS === 'ios'? "checkmark-circle-outline" : "checkmark-circle-sharp"
    const [checked,setChecked] = useState(item.complete ? true : false)
    const pan = useRef(new Animated.ValueXY()).current;
    const heightBar = useRef(new Animated.Value(500)).current;

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => item.complete ? true : false,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: pan.x, // x,y are Animated.Value
        },
        
      ], {useNativeDriver:false}),
      onPanResponderRelease: () => {
        var x = pan.x._value
        if(x <  -70 || x > 70){
          // On slide à gauche à droite jusqu'à disparition
            Animated.spring(
              pan, // Auto-multiplexed
              { toValue: 
                  { 
                    x: x>0? 400 : -400, 
                    y: 0,
                  },
                  useNativeDriver:false 
              } 
            ).start()

          // On diminue la taille de l'item supprimer pour donner un effet de slide vers le haut pour la liste
            Animated.timing(
              heightBar,
                {
                  toValue:0,
                  duration: 300,
                  useNativeDriver:false
                }
              ).start(() => {
                var list = data
                var cible = list.filter(task => task.id == item.id)
                var index = list.indexOf(cible[0])
                list.splice(index,1)
                
                firestore().collection('users').doc(userUid).update({
                  task: firestore.FieldValue.arrayRemove(item)
                })
              });
        } else {
          // Retour à la position d'origine
          Animated.spring(
            pan, // Auto-multiplexed
            { toValue: { x: 0, y: 0 }, useNativeDriver:false } 
          ).start();
        }
      }
    })
    
    // Fonction de changement de status complete
    const completeTodo = () => {
        var list = data
        var found = list.filter(task => task.id == item.id)[0]

        if(found.complete){
          found.complete = false
            setChecked(false)
        } else {
          found.complete = true
            setChecked(true)
        }

        setData(list)
        firestore().collection('users').doc(userUid).update({
            task: data
        })
    }

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[pan.getLayout(), {maxHeight:heightBar, marginVertical:2}]}
        >
            <TouchableOpacity style={{
                backgroundColor: item.complete ? '#2FA239' : 'white', 
                borderRadius:10,
                borderWidth:1,
                padding:10,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                borderColor:'#CFCFCF',
                marginHorizontal:20,
                marginVertical:2,
                width:'90%'
            }} onPress={() => completeTodo()}>
                <Text style={{color: item.complete ? 'white' : 'grey', width:'85%'}}>{item.name}</Text>
                <Icon name={icon} style={{color: item.complete ? 'white' : 'grey', width:'9%'}} size={20} />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default TodoItem