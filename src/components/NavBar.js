import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown, Modal, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/NavBar.css";
import logo from "../assets/logo.png"; // Replace with your actual logo
import User from "../assets/user.png"; // Fallback image for profile

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // State to hold the image URL for frontend display
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for showing the logout confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Fetch user profile only if the user is logged in
      fetchUserProfile();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.image) {
        const imageName = response.data.image.split('/').pop(); // Extract image name from path
        const imageResponse = await axios.get(`http://localhost:8080/images/profile/${imageName}`, {
          responseType: 'blob', // Get image as a binary blob
        });
        // Create a local URL for the image blob and set it
        const imageObjectUrl = URL.createObjectURL(imageResponse.data);
        setImageUrl(imageObjectUrl);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Error fetching profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogoutModalClose = () => setShowLogoutModal(false);
  const handleLogoutModalShow = () => setShowLogoutModal(true);

  return (
    <div>
      <Navbar expand="lg" fixed="top" className="navbar">
        <Container>
          {/* Logo on the left */}
          <Navbar.Brand href="/" className="text-white">
            <img
              src={logo}
              alt="Logo"
              className="d-inline-block align-top"
              style={{
                height: "40px",
                marginRight: "10px",
                borderRadius: "5px",
              }}
            />
          </Navbar.Brand>

          {/* Toggle button for mobile */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navbar links on the right */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {/* Show the "Home" link always */}
              <Nav.Link href="/" className="nav-link">
                Home
              </Nav.Link>

              {/* Conditionally render navbar items based on login status */}
              {isLoggedIn ? (
                <>
                  {/* "Services" button after login */}
                  <Nav.Link href="/services" className="nav-link">
                    Services
                  </Nav.Link>

                  {/* Profile icon with dropdown */}
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-profile"
                      style={{ background: "none", border: "none" }}
                    >
                      <img
                        src={imageUrl || User} // Fallback image if no profile image
                        alt="Profile"
                        className="profileImage"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => navigate("/profile")}>
                        Edit Profile
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate("/addVehicles")}>
                        Add your Vehicles
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate("/viewVehicles")}>
                        Your Vehicles
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate("/bookedHistory")}>
                        Booking History
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLogoutModalShow}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  {/* Login and SignUp buttons if not logged in */}
                  <Nav.Link href="/login" className="nav-link">
                    Login
                  </Nav.Link>
                  <Nav.Link href="/signup" className="nav-link">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to Logout?</h3>
            <div className="modal-actions">
            <button onClick={handleLogout}>Confirm</button>
            <button onClick={handleLogoutModalClose}>Cancel</button>
          </div>
        </div>
       </div>)}
  </div>
);
};
export default NavBar;

