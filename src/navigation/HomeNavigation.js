import React, {useState} from 'react'
// Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Screens
import TodoList from '../screens/TodoList'
import AjoutToDoList from '../screens/AjoutToDoList'

//Component

const Tab = createBottomTabNavigator()

const HomeNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="TodoList">
                <Tab.Screen name="TodoList" component={TodoList} />
                <Tab.Screen name="AjoutToDoList" component={AjoutToDoList} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default HomeNavigation