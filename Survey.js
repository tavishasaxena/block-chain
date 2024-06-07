import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Container, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import abi from './Survey.json';

const Survey = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [response1, setResponse1] = useState('');
  const [response2, setResponse2] = useState('');
  const [responses, setResponses] = useState([]);
  const [account, setAccount] = useState(null);
  const contractAddress = '0x119c3D01d206548C8F8149a07458Fe24c9c5474C';

  useEffect(() => {
    const initializeAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error requesting accounts:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initializeAccount();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi.abi, signer);

        const tx = await contract.submitResponse(name, email, usn, response1, response2);
        await tx.wait();
        alert('Response submitted successfully!');

        // Clear the form
        setName('');
        setEmail('');
        setUsn('');
        setResponse1('');
        setResponse2('');

        // Fetch the updated responses
        fetchResponses();
      } catch (error) {
        console.error('Error submitting response:', error);
      }
    }
  };

  const fetchResponses = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi.abi, provider);

        const responses = await contract.getResponses();
        setResponses(responses);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    }
  };

  useEffect(() => {
    if (account) {
      fetchResponses();
    }
  }, [account]);

  return (
    <Container className="mt-5">
      <h1>Bitcoin Survey</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </Form.Group>
        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </Form.Group>
        <Form.Group controlId="usn" className="mt-3">
          <Form.Label>USN</Form.Label>
          <Form.Control
            type="text"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            placeholder="Enter your USN"
            required
          />
        </Form.Group>
        <Form.Group controlId="response1" className="mt-3">
          <Form.Label>What do you think about Bitcoin?</Form.Label>
          <Form.Control
            type="text"
            value={response1}
            onChange={(e) => setResponse1(e.target.value)}
            placeholder="Enter your thoughts on Bitcoin"
            required
          />
        </Form.Group>
        <Form.Group controlId="response2" className="mt-3">
          <Form.Label>Do you think Bitcoin will be widely adopted?</Form.Label>
          <Form.Control
            type="text"
            value={response2}
            onChange={(e) => setResponse2(e.target.value)}
            placeholder="Enter your opinion on Bitcoin adoption"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Submit Response
        </Button>
      </Form>
      <div>
        <h2>Responses</h2>
        <ListGroup>
          {responses.map((res, index) => (
            <ListGroup.Item key={index}>
              <Row>
                <Col md={4}>
                  <strong>Name:</strong> {res.name} <br />
                  <strong>Email:</strong> {res.email} <br />
                  <strong>USN:</strong> {res.usn}
                </Col>
                <Col md={8}>
                  <strong>Response 1:</strong> {res.response1} <br />
                  <strong>Response 2:</strong> {res.response2}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Container>
  );
};

export default Survey;
