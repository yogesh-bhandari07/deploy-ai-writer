import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import AuthUser from './AuthUser'
const ProtectedRoute = ({children}) => {
    
    const {getToken} = AuthUser();
    const token=getToken();
 
    if(!token){
        return <Navigate to='/login' />
    }
    return children ? children : <Outlet />;
   
}

export default ProtectedRoute