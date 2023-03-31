import React,{useRef,useState} from 'react'
import {Card,Form,Alert,Container,Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import Navbar from './Navbar'
import axios from 'axios'
export default function Login() {
  const [option,setOption]=useState('option1')
const nameRef=useRef()
const topicRef=useRef()
const descriptionRef=useRef()
const [err,setErr]=useState('')
const navigate=useNavigate()
const handlesubmit=async(e)=>{
e.preventDefault()
try{
const privateroom=option==='option2' ?true:false
const res=await axios.post('/room',{
  name:nameRef.current.value,
  topic:topicRef.current.value,
  description:descriptionRef.current.value,
  private:privateroom

})

if(res.data.status==='success'){
  if(res.data.room.private===true){
    window.location.reload(navigate(`/`))

  }else{
  window.location.reload(navigate(`/room/${res.data.room.slug}`))
  }
  
}

}catch(err){
  setErr(err.response.data.message)
}
}


  return (
    <>
    <Navbar/>
    <Container style={{minHeight:'100vh'}} className='d-flex justify-content-center align-items-center'>
        <div className='w-100' style={{maxWidth:'350px'}} >
        <Card style={{ backgroundColor: '#51546e', borderRadius: '10px' }}>
        
          <h2 className='text-center mb-4'style={{
                background: ' #696d97',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                height: '3.3rem',
                color: '#e5e5e5',
                paddingTop: '4px',
              }}>Room Details </h2>
          <Card.Body>
         {err && <Alert variant='danger'>{err}</Alert> }
          <Form onSubmit={handlesubmit}>
            <Form.Group id='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control className='input-bar' type='text' ref={nameRef} placeholder='Enter Room Name'/>
            </Form.Group>
            <Form.Group id='topic'>
              <Form.Label>Topic</Form.Label>
              <Form.Control className='input-bar' type='text' ref={topicRef} placeholder='Enter Room Topic'/>
            </Form.Group>
            <Form.Group id='topic'>
              <Form.Label>Public</Form.Label>
              <div className='d-flex justify-content-around'>

              <Form.Check id='topic' type='radio' name='radio' label='YES' value='option1' checked={option==='option1'} onChange={e=>setOption(e.target.value)} />
              <Form.Check id='topic' type='radio' name='radio' label='NO' value='option2' checked={option==='option2'}  onChange={e=>setOption(e.target.value)}/>
              </div>
            

            </Form.Group>
            <Form.Group id='description' >
              <Form.Label>Description</Form.Label>
              <Form.Control className='input-bar' type='text' ref={descriptionRef} placeholder='Enter Room Description'/>
            </Form.Group>
           
            <Button type='submit'  className='w-100 mt-4 login-btn' >
              Create Room
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
        </div>
    </Container>
    </>
  )
}
