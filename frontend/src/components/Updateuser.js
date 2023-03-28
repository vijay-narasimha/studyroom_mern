import React, {  useState } from 'react';
import { Card, Form, Alert, Container, Button} from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';



export default function UpdateUser() {
 const user=JSON.parse(localStorage.getItem('profile'))
const navigate=useNavigate()
    const [err,setErr]=useState('')
    const [name,setName]=useState(user.name)
    const [bio,setBio]=useState(user.bio)
    const [file,setFile]=useState(null)
const handlesubmit=async (e)=>{
    e.preventDefault()
    const formdata=new FormData()
    formdata.append('photo',file)
    formdata.append('name',name)
    formdata.append('bio',bio)
    
    
    const res=await axios.post('/updateprofile',formdata)
    if(res.data.status=='success'){
        localStorage.setItem('profile',JSON.stringify(res.data.user))
         window.location.reload(navigate("/"))
    }
}


  return (
    <>
      <Navbar />
      <Container
        style={{ minHeight: '100vh' }}
        className='d-flex justify-content-center align-items-center translate-box'

      >
        <div className='w-100' style={{ maxWidth: '350px' }}>
          <Card style={{ backgroundColor: '#51546e', borderRadius: '10px' }}>
            <h2
              className='text-center mb-4 '
              style={{
                background: ' #696d97',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                height: '3.3rem',
                color: '#e5e5e5',
                paddingTop: '4px',
              }}
            >
              Update Profile
            </h2>
            <Card.Body>
              {err && <Alert variant='danger'>{err}</Alert>}
              <Form onSubmit={handlesubmit}>
              <Form.Group id='file'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='file'
                    className='input-bar'
                    onChange={e=>setFile(e.target.files[0])}
                    
                  />
                </Form.Group>
                <Form.Group id='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='text'
                    className='input-bar'
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    
                  />
                </Form.Group>
                <Form.Group id='bio'>
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                  as='textarea'
                    className='input-bar'
                    rows={3}
                    onChange={e=>setBio(e.target.value)}
                value={bio}
                  />
                </Form.Group>

                <Button type='submit' className='mt-4 login-btn'>
                
                  Update User
                </Button>
              </Form>
             
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
