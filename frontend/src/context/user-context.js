import { useState, useEffect, createContext, useContext } from "react"
import { NotificationManager } from "react-notifications"
import { BackendApi } from "../client/backend-api"
import users from '../client/backend-api/users.json';

const UserContext = createContext({
    user: null,
    loginUser: () => { },
})

const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(user && user.role === 'admin')
    }, [user])

    useEffect(() => {
        BackendApi.user.getProfile().then(({ user, error }) => {
            if (error) {
                console.error(error)
            } else {
                setUser(user)
            }
        }).catch(console.error)
    }, [])

    const loginUser = async (username, password) => {
        //const { user, error } = await BackendApi.user.login(username, password)
        let user , error;
        user = await users.filter(user=>user.username===username);
        if(user.length>0){
            user[0].password === password
                ? user = await user[0]
                : error = "Error al validar las credenciales";
        }else{
            error = "Error al validar las credenciales";
        }
        if (error) {
            console.log(error)
            NotificationManager.error(error)
        } else {
            console.log(user)
            NotificationManager.success("Logged in successfully")
            setUser(user)
        }
    }

    const logoutUser = async () => {
        setUser(null)
        await BackendApi.user.logout()
    }

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, isAdmin }}>
            {children}
        </UserContext.Provider>
    )
}

export { useUser, UserProvider }