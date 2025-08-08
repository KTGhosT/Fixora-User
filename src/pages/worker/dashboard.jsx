import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <h2>Worker Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Worker 1</Card.Title>
              <Card.Text>Status: Active</Card.Text>
              <Button variant="primary">View Details</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Worker 2</Card.Title>
              <Card.Text>Status: On Break</Card.Text>
              <Button variant="primary">View Details</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Add New Worker</Card.Title>
              <Button variant="success" href="/register">Register Worker</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;