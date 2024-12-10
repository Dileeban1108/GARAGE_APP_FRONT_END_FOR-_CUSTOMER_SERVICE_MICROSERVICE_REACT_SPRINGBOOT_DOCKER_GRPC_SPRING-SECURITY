import React, { useState } from "react";
import "../styles/HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";

const ForgotPasswordPage=()=>{
  const [formValues, setFormValues] = useState({
    email: "",
    phoneNo: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Country code map for validation
  const countryCodes = {
    US: { code: "+1", phoneLength: 10 },
    IN: { code: "+91", phoneLength: 10 },
    UK: { code: "+44", phoneLength: 10 },
    // Add more countries as needed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    // Email Validation
    if (!formValues.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      newErrors.email = "Email is invalid";
    // Phone Number Validation based on country code
    const selectedCountry = countryCodes[formValues.countryCode];
    const phoneLength = selectedCountry ? selectedCountry.phoneLength : 10; // Default to 10 if not found

    if (!formValues.phoneNo) newErrors.phoneNo = "Phone Number is required";
    else if (!/^\d+$/.test(formValues.phoneNo))
      newErrors.phoneNo = "Phone Number should only contain numbers";
    else if (formValues.phoneNo.length !== phoneLength)
      newErrors.phoneNo = `Phone Number should be ${phoneLength} digits long`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const userData = {
        email: formValues.email,
        phoneNo: formValues.phoneNo
      };
      axios
        .post("http://localhost:8080/auth/forgotPassword", userData)
        .then((response) => {
          console.log("verified successfully:", response.data);
          navigate("/resetPassword", { state: { email: formValues.email } });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrors({ ...errors, form: "try again." });
        });
    }
  };

  return (
    <div className="mainDev">
      <NavBar />

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
            Fogot Password
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem" }}
          >
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
            <div className="mb-3 d-flex">
              <select
                name="countryCode"
                className="form-control"
                style={{
                  width: "30%",
                  marginRight: "10px",
                  padding: "10px",
                  fontSize: "1rem",
                }}
                value={formValues.countryCode}
                onChange={handleChange}
              >
                <option value="US">+1 (US)</option>
                <option value="IN">+91 (IN)</option>
                <option value="UK">+44 (UK)</option>
                {/* Add more countries as needed */}
              </select>
              <input
                placeholder="Phone Number"
                type="tel"
                name="phoneNo"
                className="form-control"
                style={{
                  width: "70%",
                  padding: "10px",
                  fontSize: "1rem",
                }}
                value={formValues.phoneNo}
                onChange={handleChange}
              />
            </div>
            {errors.phoneNo && <p style={{ color: "red" }}>{errors.phoneNo}</p>}
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
                Submit
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: ".5rem" }}>
              <p>
                Back to Home?{" "}
                <Link to="/" style={{ textDecoration: "none" }}>
                  Home
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
