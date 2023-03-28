import { Navigate } from "react-router-dom";

export default function PrivateRoute({children}){
    const user=JSON.parse(localStorage.getItem("profile") )|| "";
    if(!user) return <Navigate to='/login'></Navigate>
    return children
}