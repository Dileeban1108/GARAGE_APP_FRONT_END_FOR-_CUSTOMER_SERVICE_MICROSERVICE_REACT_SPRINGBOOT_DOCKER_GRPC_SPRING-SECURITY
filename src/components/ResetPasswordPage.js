import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const ResetPasswordPage = () => {
  const { state } = useLocation();
  const [formValues, setFormValues] = useState({
    email: state?.email || "", // Coming from the ForgotPasswordPage
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
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
    if (!formValues.newPassword) newErrors.newPassword = "Password is required";
    if (formValues.newPassword !== formValues.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      axios
        .post("http://localhost:8080/auth/resetPassword", {
          email: formValues.email,
          verificationCode: formValues.verificationCode,
          password: formValues.newPassword,
        })
        .then((response) => {
          toast.success("password reset successfully");
          console.log(response.data)
          navigate("/login");
        })
        .catch((error) => {
          setLoading(false);
          setErrors({
            ...errors,
            form: "Error resetting password. Please try again.",
          });
          toast.error("password reset fail");
        });
    }
  };

  return (
    <div className="mainDev">
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
            Reset Password
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
                placeholder="New Password"
                type="password"
                name="newPassword"
                className="form-control"
                value={formValues.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && (
                <p style={{ color: "red" }}>{errors.newPassword}</p>
              )}
            </div>
            <div className="mb-3">
              <input
                placeholder="Confirm Password"
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

export default ResetPasswordPage;
