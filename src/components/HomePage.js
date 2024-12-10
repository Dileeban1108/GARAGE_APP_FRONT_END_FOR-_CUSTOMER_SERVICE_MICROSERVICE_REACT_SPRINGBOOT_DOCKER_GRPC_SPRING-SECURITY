import React, { useState, useEffect } from "react";
import "../styles/HomePage.css"; // Custom styles for this page
import NavBar from "./NavBar";
import {
  Container,
  Row,
  Col
} from "react-bootstrap";

const HomePage = () => {
  const [name, setName] = useState(""); // State to store user name

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    console.log(storedName);
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="home-page">
      {/* Navbar */}
      <NavBar />

      {/* Main Content Section */}
      <Container fluid className="hero-section">
        <Row className="justify-content-center text-center">
          <Col
            md={8}
            style={{
              backgroundColor: "white",
              width: "80vw",
              padding: "10px",
              height: "20vh",
              borderRadius: "5px",
              color: "#0080ff",
            }}
          >
            {/* Display user name or fallback if not found */}
            <h2>Welcome {name ? `to Our Home Page, ${name.toUpperCase()}` : "to Our Home Page"}</h2>
            <p style={{ color: "#0080ff" }}>
              Your trusted garage service provider for all your vehicle needs.
            </p>
          </Col>
        </Row>
      </Container>

      {/* About Section */}
      <Container className="about-section">
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h2 className="about-title">Why Choose Us?</h2>
            <p className="about-description">
              We offer high-quality, affordable, and reliable garage services.
              Whether it's a minor repair or a major overhaul, our experienced
              technicians are here to help you keep your car running smoothly.
            </p>
          </Col>
        </Row>
        <Row className="services-list text-center">
          <Col md={4} className="subservices">
            <h3 className="service-title">Expert Technicians</h3>
            <p className="service-description" style={{ color: "black" }}>
              Our certified mechanics ensure top-quality repairs.
            </p>
          </Col>
          <Col md={4} className="subservices">
            <h3 className="service-title">Affordable Prices</h3>
            <p className="service-description" style={{ color: "black" }}>
              We provide transparent and competitive pricing.
            </p>
          </Col>
          <Col md={4} className="subservices">
            <h3 className="service-title">Fast & Reliable</h3>
            <p className="service-description" style={{ color: "black" }}>
              We work efficiently to get your car back on the road quickly.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <footer className="footer">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="footer-text">
                © 2024 Garage Service. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
