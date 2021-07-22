import React, {useState, createContext} from 'react'

// Navigation
import AuthNavigation from './AuthNavigation'

// Context
import { UserContext } from '../context/UserContext'
import TodoList from '../screens/TodoList'

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
                <TodoList />
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