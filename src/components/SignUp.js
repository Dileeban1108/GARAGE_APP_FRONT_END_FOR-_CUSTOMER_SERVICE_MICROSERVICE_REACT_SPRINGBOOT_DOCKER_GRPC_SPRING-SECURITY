import React, { useState } from "react";
import "../styles/HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css"; // Make sure this line is present

function SignUp() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handlePhoneChange = (value) => {
    setFormValues({ ...formValues, phoneNo: value });
  };

  const validate = () => {
    const newErrors = {};

    // Name Validation
    if (!formValues.name) newErrors.name = "Name is required";

    // Email Validation
    if (!formValues.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      newErrors.email = "Email is invalid";

    // Password Validation
    if (!formValues.password) newErrors.password = "Password is required";
    else if (formValues.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(formValues.password))
      newErrors.password =
        "Password must contain at least one uppercase letter";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formValues.password))
      newErrors.password = "Password must contain at least one symbol";

    // Confirm Password Validation
    if (!formValues.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formValues.confirmPassword !== formValues.password)
      newErrors.confirmPassword = "Passwords do not match";

    // Phone Number Validation
    const phoneNumber = formValues.phoneNo;
    if (!phoneNumber) newErrors.phoneNo = "Phone Number is required";
    else if (!isValidPhoneNumber(phoneNumber))
      newErrors.phoneNo = "Phone Number is invalid";

    // Address Validation
    if (!formValues.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const userData = {
        name: formValues.name,
        email: formValues.email,
        phoneNo: formValues.phoneNo,
        address: formValues.address,
        password: formValues.password,
      };
      axios
        .post("http://localhost:8080/auth/signup", userData)
        .then((response) => {
          console.log("User registered successfully:", response.data);
          toast.success("User registered successfully");
          navigate("/verify", { state: { email: formValues.email } });
        })
        .catch((error) => {
          console.error("Error during signup:", error);
          toast.error("Error during signup!");
          setErrors({ ...errors, form: "Signup failed, please try again." });
        });
    }
  };

  return (
    <div className="mainDev">
      <NavBar />
      {/* Toast Container for displaying toast notifications */}
      <ToastContainer />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh", marginTop: "60px" }}
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
            Sign Up
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem" }}
          >
            <div className="mb-3">
              <input
                placeholder="Name:"
                type="text"
                name="name"
                className="form-control"
                value={formValues.name}
                onChange={handleChange}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>
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
            <div className="mb-3">
              <input
                placeholder="Confirm Password:"
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formValues.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mb-3 d-flex">
              <PhoneInput
                international
                defaultCountry="US"
                name="phoneNo"
                value={formValues.phoneNo}
                onChange={handlePhoneChange}
                className="phone-input"
              />
            </div>
            {errors.phoneNo && <p style={{ color: "red" }}>{errors.phoneNo}</p>}
            <div className="mb-3">
              <input
                placeholder="Address"
                type="text"
                name="address"
                className="form-control"
                value={formValues.address}
                onChange={handleChange}
              />
              {errors.address && (
                <p style={{ color: "red" }}>{errors.address}</p>
              )}
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1rem",
                  width: "100%",
                }}
              >
                Sign Up
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: ".5rem" }}>
              <p>
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
