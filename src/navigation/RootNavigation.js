import React, {useState, createContext} from 'react'

// Navigation
import HomeNavigation from './HomeNavigation'
import AuthNavigation from './AuthNavigation'

// Context
import { UserContext } from '../context/UserContext'

const RootNavigation = () => {
    const [user, setUser] = useState()
    const [initialized, setInitialized] = useState(false)
    const data = {
        user:user,
        setUser:() => setUser()
    }

    return (
        <UserContext.Provider value={ data }>
            {
                user ? 
                <HomeNavigation /> 
                : 
                <AuthNavigation 
                    initialized={initialized} 
                    setInitialized={setInitialized} 
                    user={user} 
                    setUser={setUser}     
                />
            }
        </UserContext.Provider>
    )
}
export default RootNavigation