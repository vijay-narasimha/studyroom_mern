import React,{useRef,useState} from 'react'
import {Card,Form,Alert,Container,Button} from 'react-bootstrap'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
export default function Signup() {

const emailRef=useRef()
const nameRef=useRef()
const passwordRef=useRef()
const passwordconfirmRef=useRef()
const navigate=useNavigate()
const [err,setErr]=useState("")
const handlesubmit=async(e)=>{
  e.preventDefault()
  try{
  const res=await axios.post("/signup",{
    name:nameRef.current.value,
    email:emailRef.current.value,
    password:passwordRef.current.value,
    passwordconfirm:passwordconfirmRef.current.value
  })
  if(res.data.status==='success'){
    localStorage.setItem("profile",JSON.stringify(res.data.user))
    localStorage.setItem('token',JSON.stringify(res.data.token))

    window.location.reload(navigate('/'))
  }
  }catch(err){
setErr(err.response.data.message)
  }
}

  return (
    <>
    <Navbar/>
    <Container style={{minHeight:'100vh'}} className='d-flex justify-content-center align-items-center translate-box'>
        <div className='w-100' style={{maxWidth:'350px'}} >
        <Card style={{ backgroundColor: '#51546e', borderRadius: '10px' }}>
        <h3 className='text-center mb-4'  style={{
                background: ' #696d97',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                height: '3.3rem',
                color: '#e5e5e5',
                paddingTop: '4px',
              }}>Sign Up </h3>

        <Card.Body>
          {err && <Alert variant='danger'>{err}</Alert>}
          <Form onSubmit={handlesubmit} >
          <Form.Group id='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control className='input-bar'type='text' ref={nameRef} placeholder='Enter Name'  />
            </Form.Group>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control className='input-bar'type='email' ref={emailRef} placeholder='Enter Email' />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control className='input-bar'type='password' ref={passwordRef}  placeholder='Enter Password'/>
            </Form.Group>
            <Form.Group id='confirmpassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control className='input-bar'type='password' ref={passwordconfirmRef} placeholder='Enter confirm password' />
            </Form.Group>
            <Button type='submit' className='mt-4 login-btn' >
            <FontAwesomeIcon icon={faLock} className='me-2'/>

              Sign Up
            </Button>
          </Form>
          <div className='w-100 text-center mt-2'>
        
        Already have an account? <Link to='/login' className='linkbtn'>Login</Link>
      </div>
        </Card.Body>
      </Card>
    
        </div>
    </Container>
    </>
  )
}
