import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfilePage.css";
import NavBar from "./NavBar";
import User from "../assets/user.png"; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    image: null,
  });
  const [initialUserData, setInitialUserData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    gender: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [isEmailUpdating, setIsEmailUpdating] = useState(false); // State to check if email update is in progress
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserData({
        name: response.data.name,
        email: response.data.email,
        phoneNo: response.data.phoneNo,
        address: response.data.address,
        gender: response.data.gender,
        image: response.data.image,
      });
      localStorage.setItem("userName", response.data.name);
      setInitialUserData({
        name: response.data.name,
        email: response.data.email,
        phoneNo: response.data.phoneNo,
        address: response.data.address,
        gender: response.data.gender,
        image: response.data.image,
      });
      if (response.data.image) {
        const imageName = response.data.image.split("/").pop();
        const imageResponse = await axios.get(
          `http://localhost:8080/images/profile/${imageName}`,
          { responseType: "blob" }
        );
        const imageObjectUrl = URL.createObjectURL(imageResponse.data);
        setImageUrl(imageObjectUrl);
      }
    } catch (err) {
      setError("Error fetching profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleEmailSubmit = () => {
    setShowModal(true); // Show the confirmation modal when the user clicks the "Update Email" button
  };

  const handleConfirmEmailUpdate = async () => {
    setLoading1(true);
    try {
      await axios.post(
        "http://localhost:8080/auth/changeEmail",
        { email: userData.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/resetEmail");
    } catch (error) {
      setError("Error updating email");
    } finally {
      setLoading1(false);
      setShowModal(false); // Close the modal after confirming the email update
    }
  };

  const handleCancelEmailUpdate = () => {
    setShowModal(false); // Close the modal if the user cancels the email update
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phoneNo", userData.phoneNo);
    formData.append("address", userData.address);
    formData.append("gender", userData.gender);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/auth/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData({
        ...userData,
        image: response.data.image,
      });
      setLoading(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      setLoading(false);
      setError("Error updating profile");
      toast.error("Error updating profile");

    }
  };
  const isProfileChanged = () => {
    return (
      userData.name !== initialUserData.name ||
      userData.phoneNo !== initialUserData.phoneNo ||
      userData.address !== initialUserData.address ||
      userData.gender !== initialUserData.gender ||
      userData.image !== initialUserData.image
    );
  };
  return (
    <div className="profile-page">
      <NavBar />
      <ToastContainer />
      <div className="profile-update-form">
        <form onSubmit={handleSubmit}>
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src={imageUrl || User}
                alt="Profile"
                className="profile-image"
              />
              <label htmlFor="image-upload" className="camera-icon">
                <i className="fas fa-camera"></i>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="profileRow">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="profileRow">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              readOnly
              disabled
            />
          </div>
          <div className="profileRow">
            <label htmlFor="phoneNo">Phone No:</label>
            <input
              type="text"
              id="phoneNo"
              name="phoneNo"
              value={userData.phoneNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="profileRow">
            <label htmlFor="address">Address:</label>
            <input
              id="address"
              name="address"
              value={userData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="profileRow">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select an Option</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" disabled={loading || !isProfileChanged()}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <button
          style={{ backgroundColor: "gray", width: "100%" }}
          onClick={handleEmailSubmit}
          disabled={loading1}
        >
          {loading1 ? "Sending a verification code..." : "Update Email"}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to update your email?</h3>
            <div className="modal-actions">
              <button onClick={handleConfirmEmailUpdate}>Confirm</button>
              <button onClick={handleCancelEmailUpdate}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
