import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Axios from "axios"; // Import Axios
import "../styles/HomePage.css"; // Custom styles for this page
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

function SignIn({ onSubmit }) {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // For loading spinner or state
  const [backendError, setBackendError] = useState(""); // To show error message from the backend
  const navigate = useNavigate(); // To navigate the user after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!formValues.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Start loading
      setBackendError(""); // Clear any previous errors

      try {
        // Send POST request to the backend API for login using Axios
        const response = await Axios.post(
          "http://localhost:8080/auth/login",
          formValues,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // If the login is successful, you get a JWT token
        console.log("Login successful:", response.data);
        toast.success("Login successfuly");

        // Store the JWT token in localStorage
        localStorage.setItem("token", response.data.token);

        // Navigate to the home page or any other page after login
        navigate("/");
      } catch (error) {
        setLoading(false); // Stop loading
        // Handle errors if the request fails
        if (error.response) {
          setBackendError(error.response.data.message || "Login failed");
        } else {
          setBackendError("An unexpected error occurred");
        }
        console.error("Login failed:", error);
        toast.error("Login failed!");
      } finally {
        setLoading(false); // Stop loading in any case
      }
    }
  };

  return (
    <div className="mainDev">
      <NavBar />
      {/* Toast Container for displaying toast notifications */}
      <ToastContainer />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2rem",
            borderRadius: "10px",
            backgroundColor: "#f7f7f7",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontFamily: '"Arial", sans-serif',
              fontSize: "1.5rem",
            }}
          >
            Sign In
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem" }}
          >
            {/* Form fields */}
            <div className="mb-3">
              <input
                placeholder="Email:"
                type="email"
                name="email"
                className="form-control"
                value={formValues.email}
                onChange={handleChange}
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>
            {/* Password input field */}
            <div className="mb-3">
              <input
                placeholder="Password:"
                type="password"
                name="password"
                className="form-control"
                value={formValues.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
            </div>

            {/* Show loading indicator while submitting */}
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1rem",
                  width: "100%",
                }}
                disabled={loading} // Disable the button while loading
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Show error message from backend */}
          {backendError && (
            <div
              style={{ color: "red", textAlign: "center", marginTop: "10px" }}
            >
              <p>{backendError}</p>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: ".5rem" }}>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Sign Up
              </Link>
            </p>
            <p>
              Forgot Password?{" "}
              <Link to="/forgotPassword" style={{ textDecoration: "none" }}>
                click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
