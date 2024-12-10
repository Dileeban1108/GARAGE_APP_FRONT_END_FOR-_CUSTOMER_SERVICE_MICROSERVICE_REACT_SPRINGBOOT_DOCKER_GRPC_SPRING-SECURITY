import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddVehicle.css";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

function AddVehicle() {
  const [formValues, setFormValues] = useState({
    vehicleNo: "",
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    fuelType: "",
  });

  const [errors, setErrors] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

  const navigate = useNavigate();

  // Fetch vehicle types from backend API
  const fetchVehicleTypes = () => {
    axios
      .get("http://localhost:8080/api/vehicle-models/types")
      .then((response) => {
        setVehicleTypes(response.data); // Set vehicle types from response
      })
      .catch((error) => {
        console.error("Error fetching vehicle types:", error);
        toast.error("Error fetching vehicle types!");
      });
  };

  // Fetch vehicle brands based on selected vehicle type
  const fetchVehicleBrands = (vehicleType) => {
    if (!vehicleType) return;
    axios
      .get("http://localhost:8080/api/vehicle-models/brands", {
        params: { vehicleType },
      })
      .then((response) => {
        setVehicleBrands(response.data); // Set brands based on vehicle type
        setFormValues((prev) => ({
          ...prev,
          vehicleBrand: "", // Reset vehicle brand
          vehicleModel: "", // Reset vehicle model
        }));
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        toast.error("Error fetching brands!");
      });
  };

  // Fetch vehicle models based on selected vehicle type and brand
  const fetchVehicleModels = (vehicleType, vehicleBrand) => {
    if (!vehicleType || !vehicleBrand) return;
    axios
      .get("http://localhost:8080/api/vehicle-models/models", {
        params: { vehicleType, brandName: vehicleBrand },
      })
      .then((response) => {
        setVehicleModels(response.data); // Set models based on vehicle type and brand
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
        toast.error("Error fetching models!");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => {
      const newState = { ...prevState, [name]: value };

      // If vehicleType is changed, fetch the corresponding brands and reset models
      if (name === "vehicleType") {
        fetchVehicleBrands(value); // Fetch brands for the selected type
        setVehicleModels([]); // Reset models
        newState.vehicleBrand = ""; // Reset brand
        newState.vehicleModel = ""; // Reset model
      }

      // If vehicleBrand is changed, fetch the corresponding models
      if (name === "vehicleBrand") {
        fetchVehicleModels(formValues.vehicleType, value); // Fetch models for selected brand
        newState.vehicleModel = ""; // Reset model
      }

      return newState;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.vehicleNo) newErrors.vehicleNo = "Vehicle Number is required";
    if (!formValues.vehicleType) newErrors.vehicleType = "Vehicle Type is required";
    if (!formValues.vehicleBrand) newErrors.vehicleBrand = "Vehicle Brand is required";
    if (!formValues.vehicleModel) newErrors.vehicleModel = "Vehicle Model is required";
    if (!formValues.fuelType) newErrors.fuelType = "Fuel Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios
        .post("http://localhost:8080/bookings/addVehicle", formValues, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Vehicle added successfully:", response.data);
          toast.success("Vehicle added successfully!");
          setTimeout(() => {
            navigate("/viewVehicles");
          }, 1000);
        })
        .catch((error) => {
          console.error("Error adding vehicle:", error);
          toast.error("Error adding vehicle!");
        });
    }
  };

  // Fetch vehicle types on component mount
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  return (
    <div className="add-vehicles">
      <NavBar />
      <ToastContainer />
      <div className="add-vehicle-form">
        <h2>Add Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              placeholder="Vehicle Number:[SN-2020]"
              type="text"
              name="vehicleNo"
              value={formValues.vehicleNo}
              onChange={handleChange}
            />
            {errors.vehicleNo && <p>{errors.vehicleNo}</p>}
          </div>

          <div className="form-group">
            <select
              name="vehicleType"
              value={formValues.vehicleType}
              onChange={handleChange}
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.vehicleType && <p>{errors.vehicleType}</p>}
          </div>

          <div className="form-group">
            <select
              name="vehicleBrand"
              value={formValues.vehicleBrand}
              onChange={handleChange}
              disabled={!formValues.vehicleType} // Disabled until vehicle type is selected
            >
              <option value="">Select Vehicle Brand</option>
              {vehicleBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.vehicleBrand && <p>{errors.vehicleBrand}</p>}
          </div>

          <div className="form-group">
            <select
              name="vehicleModel"
              value={formValues.vehicleModel}
              onChange={handleChange}
              disabled={!formValues.vehicleBrand} // Disabled until vehicle brand is selected
            >
              <option value="">Select Vehicle Model</option>
              {vehicleModels.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {errors.vehicleModel && <p>{errors.vehicleModel}</p>}
          </div>

          <div className="form-group">
            <select
              name="fuelType"
              value={formValues.fuelType}
              onChange={handleChange}
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map((fuel, index) => (
                <option key={index} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
            {errors.fuelType && <p>{errors.fuelType}</p>}
          </div>
          <button type="submit">Add Vehicle</button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
