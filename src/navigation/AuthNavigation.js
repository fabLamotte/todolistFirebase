import React from 'react'
// Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Screens
import Inscription from '../screens/Inscription'
import Connexion from './../screens/Connexion'

const Tab = createBottomTabNavigator()

const AuthNavigation = (props) => {
    const {
        initialized,
        setInitialized,
        user,
        setUser
    } = props

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Connexion">
                <Tab.Screen name="Connexion">
                    {() => 
                    <Connexion 
                        initialized={initialized} 
                        setInitialized={setInitialized} 
                        user={user} 
                        setUser={setUser} 
                    />}
                </Tab.Screen>
                <Tab.Screen name="Inscription" component={Inscription} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default AuthNavigation