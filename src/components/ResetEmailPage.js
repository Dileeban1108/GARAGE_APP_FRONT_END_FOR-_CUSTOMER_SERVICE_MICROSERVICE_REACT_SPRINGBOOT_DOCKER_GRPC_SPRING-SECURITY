import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const ResetEmailPage = () => {
  const [formValues, setFormValues] = useState({
    verificationCode: "",
    newEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.verificationCode)
      newErrors.verificationCode = "Verification code is required";
    if (!formValues.newEmail) newErrors.newEmail = "New email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      axios
        .post(
          "http://localhost:8080/auth/resetEmail",
          {
            verificationCode: formValues.verificationCode,
            email: formValues.newEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          // Assuming the response contains the new JWT token
          const newToken = response.data;

          // Save the new token to localStorage
          localStorage.setItem("token", newToken);
          toast.success("Email reset successfully");
          console.log(response.data);
          setFormValues({
            verificationCode: "",
            newEmail: "",
          });

          // Navigate to the home page or wherever you want
          navigate("/"); // Navigate to the home page or a relevant page
        })
        .catch((error) => {
          setLoading(false);
          setErrors({
            ...errors,
            form: error.response?.data?.message || "Error resetting email. Please try again.",
          });
          toast.error("Email reset fail");
        });
    }
  };

  return (
    <div className="mainDev">
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
            Reset Email
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                placeholder="Verification Code"
                type="text"
                name="verificationCode"
                className="form-control"
                value={formValues.verificationCode}
                onChange={handleChange}
              />
              {errors.verificationCode && (
                <p style={{ color: "red" }}>{errors.verificationCode}</p>
              )}
            </div>
            <div className="mb-3">
              <input
                placeholder="New Email"
                type="email"
                name="newEmail"
                className="form-control"
                value={formValues.newEmail}
                onChange={handleChange}
              />
              {errors.newEmail && (
                <p style={{ color: "red" }}>{errors.newEmail}</p>
              )}
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1rem",
                  width: "100%",
                }}
              >
                {loading ? "Resetting..." : "Submit"}
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
};

export default ResetEmailPage;
