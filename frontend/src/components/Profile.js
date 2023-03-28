import React from 'react'
import { useParams ,Navigate} from 'react-router-dom'
import UserProfile from './UserProfile'

export default function Profile() {

  const {id}=useParams()
  const user=JSON.parse(localStorage.getItem('profile')) || ''
  
  if (user && user.name===id) return <Navigate to='/profile'></Navigate>
  
return <UserProfile id={id}/>
  
}
