import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap";

function ViewVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [vehicleToRemove, setVehicleToRemove] = useState(null); // State to store the vehicle to remove

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Adjust URL if necessary (e.g., add the base URL if needed)
        const response = await axios.get(
          `http://localhost:8080/bookings/getVehicles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVehicles(response.data); // Store fetched bookings in state
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to load vehicles.");
      } finally {
        setLoading(false); // Set loading to false once the request is done
      }
    };

    fetchVehicles();
  }, []);
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Loading booking history...</p>
      </div>
    );
  }

  // Handle vehicle removal
  const handleRemoveVehicle = () => {
    if (!vehicleToRemove) return;

    axios
      .delete(
        `http://localhost:8080/bookings/deleteVehicle/${vehicleToRemove}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setVehicles(
          vehicles.filter((vehicle) => vehicle.vehicleNo !== vehicleToRemove)
        );
        toast.success("Vehicle removed successfully!");
        setShowModal(false); // Close the modal
      })
      .catch((error) => {
        toast.error("Error removing vehicle!");
        setShowModal(false); // Close the modal
      });
  };

  const handleCancelRemoveVehicle = () => {
    setShowModal(false); // Close the modal if the user cancels the removal
  };

  const openModal = (vehicleNo) => {
    setVehicleToRemove(vehicleNo); // Set the vehicle to remove
    setShowModal(true); // Show the modal
  };

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="add-vehicles">
      <NavBar />
      <ToastContainer />

      <div className="container mt-5">
        <h2 style={{textAlign:"center"}}>Vehicle List</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Vehicle Brand</th>
              <th>Vehicle Model</th>
              <th>Fuel Type</th>
              <th>Actions</th> {/* Added column for actions */}
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="5">No Vehicles found</td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.vehicleNo}>
                  <td>{vehicle.vehicleNo}</td>
                  <td>{vehicle.vehicleBrand}</td>
                  <td>{vehicle.vehicleModel}</td>
                  <td>{vehicle.fuelType}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => openModal(vehicle.vehicleNo)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      {showModal && vehicleToRemove && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to remove this vehicle?</h3>
            <div className="modal-actions">
              <button onClick={handleRemoveVehicle}>Confirm</button>
              <button onClick={handleCancelRemoveVehicle}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewVehicles;
