import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Topics from '../components/Topics';
import Room from '../components/Room';
import { Container, Row, Col } from 'react-bootstrap';

export default function Home() {
  const [topicname, setTopicname] = useState('');

  return (
    <>
      <Navbar />
      <Container style={{ minHeight: '100vh' }}>
        <Row>
          <Col md={3} className='d-none d-lg-block'>
            {' '}
            <Topics setTopicname={setTopicname} topicname={topicname}/>
          </Col>
          <Col>
            <Room topicname={topicname} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
