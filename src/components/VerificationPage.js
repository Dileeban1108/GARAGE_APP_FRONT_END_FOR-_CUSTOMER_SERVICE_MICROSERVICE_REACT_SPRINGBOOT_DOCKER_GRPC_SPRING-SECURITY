import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/HomePage.css";

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const handleChange = (e) => {
    const { value } = e.target;
    setVerificationCode(value);
  };

  const validate = () => {
    const newErrors = {};
    if (!verificationCode)
      newErrors.verificationCode = "Verification code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post("http://localhost:8080/auth/verify", {
          email,
          verificationCode,
        });
        setMessage("Verification successful! Please proceed to login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Error during verification:", error);
        setErrors({
          ...errors,
          form: "Verification failed, please try again.",
        });
      }
    }
  };
  const handleResendCode = async () => {
    try {
      // Send the email as a query parameter in the URL
      await axios.post(`http://localhost:8080/auth/resend?toEmail=${email}`);
      setMessage("A new verification code has been sent to your email.");
    } catch (error) {
      console.error("Error during resend:", error);
      setMessage("Failed to resend verification code.");
    }
  };
  
  return (
    <div className="mainDev">
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
            Verify Your Email
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{ fontFamily: "Arial, sans-serif", fontSize: "1rem" }}
          >
            <div className="mb-3">
              <input
                placeholder="Verification Code"
                type="text"
                name="verificationCode"
                className="form-control"
                value={verificationCode}
                onChange={handleChange}
              />
              {errors.verificationCode && (
                <p style={{ color: "red" }}>{errors.verificationCode}</p>
              )}
            </div>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {errors.form && <p style={{ color: "red" }}>{errors.form}</p>}

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
                Verify Code
              </button>
            </div>
          </form>

          <div style={{ textAlign: "center",marginTop:".5rem"}}>
            <p>
              Didn't Recieve Code?
              <button
                onClick={handleResendCode}
                className="btn btn-link"
                style={{ textDecoration: "none" }}
              >
                Resend Code
              </button>
            </p>
              <p>
                Try with Another Email
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Sign Up
                </button>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
