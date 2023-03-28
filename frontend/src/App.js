import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createContext } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import CreateRoom from './components/createRoom'
import PrivateRoute from './privateroute';
import Roompage from './pages/RoomPage'
import EditRoom from './components/EditRoom'
import UpdateUser from './components/Updateuser'
import Profile from './components/Profile';
import Myprofile from './components/Myprofile';
import axios from 'axios'
axios.defaults.baseURL=process.env.REACT_APP_SERVER_URL
axios.defaults.withCredentials=true

export const UserContext=createContext()

function App() {
if(document.cookie=="") localStorage.clear()

const user=JSON.parse(localStorage.getItem("profile") )|| "";



  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },{
      path:'/',
      element:<Home/>
    },{
      path:'/create-room',
      element:<PrivateRoute><CreateRoom/></PrivateRoute>
    },{
      path:'/room/:id',
      element:<Roompage/>
    },{
      path:'/edit-room/:id',
      element:<PrivateRoute><EditRoom/></PrivateRoute>
    },{
      path:'/edit-profile',
      element:<PrivateRoute><UpdateUser/></PrivateRoute>
    },{
      path:'userprofile/:id',
      element:<Profile/>
    },{
      path:'profile',
      element:<PrivateRoute><Myprofile/></PrivateRoute>
    }
  ]);


  return (
  
  <UserContext.Provider value={{user}}>

<RouterProvider router={router} />

  </UserContext.Provider>
  
  
  );
}

export default App;
