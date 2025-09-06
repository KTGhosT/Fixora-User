import React, { useState } from "react";
import { Container, Card, Button, Nav, ListGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const orders = [
    { id: 1, service: "Plumbing - Leak Fix", date: "2025-09-01", status: "Completed" },
    { id: 2, service: "Carpenter - Door Repair", date: "2025-08-20", status: "In Progress" },
  ];

  const cancellations = [
    { id: 1, service: "Electrician - Wiring", date: "2025-08-10", reason: "Customer cancelled" },
  ];

  return (
    <Container className="py-5">
      <Card className="shadow-lg rounded-4 mx-auto" style={{ maxWidth: "600px" }}>
        {/* Profile Header */}
        <Card.Body className="text-center">
          <img
            src="https://i.pravatar.cc/150"
            alt="User"
            className="rounded-circle mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h4 className="fw-bold">Vaisnavi</h4>
          <p className="text-muted">@vaisnaviraj</p>
        </Card.Body>

        {/* Navigation Tabs */}
        <Nav variant="tabs" className="justify-content-center" activeKey={activeTab}>
          <Nav.Item>
            <Nav.Link eventKey="profile" onClick={() => setActiveTab("profile")}>
              Profile
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders" onClick={() => setActiveTab("orders")}>
              Orders
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="cancellations" onClick={() => setActiveTab("cancellations")}>
              Cancellations
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Tab Content */}
        <Card.Body>
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ListGroup variant="flush" className="text-start">
                  <ListGroup.Item>📍 Located in Sri Lanka</ListGroup.Item>
                  <ListGroup.Item>👤 Joined in March 2025</ListGroup.Item>
                  <ListGroup.Item>💬 English (Conversational), Tamil (Fluent)</ListGroup.Item>
                  <ListGroup.Item>⏰ Preferred hours: Mon-Sun, 8:00 AM – 9:00 PM</ListGroup.Item>
                </ListGroup>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button variant="outline-dark">Preview Public Profile</Button>
                  <Button variant="primary">Edit</Button>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <h5 className="mb-3 text-center">My Orders</h5>
                <ListGroup>
                  {orders.map((order) => (
                    <ListGroup.Item key={order.id} className="d-flex justify-content-between">
                      <div>
                        <strong>{order.service}</strong>
                        <br />
                        <small>{order.date}</small>
                      </div>
                      <span
                        className={`badge rounded-pill ${
                          order.status === "Completed" ? "bg-success" : "bg-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </motion.div>
            )}

            {activeTab === "cancellations" && (
              <motion.div
                key="cancellations"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <h5 className="mb-3 text-center">My Cancellations</h5>
                <ListGroup>
                  {cancellations.map((cancel) => (
                    <ListGroup.Item key={cancel.id}>
                      <strong>{cancel.service}</strong> <br />
                      <small>{cancel.date}</small> <br />
                      <span className="text-danger">{cancel.reason}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Account;
