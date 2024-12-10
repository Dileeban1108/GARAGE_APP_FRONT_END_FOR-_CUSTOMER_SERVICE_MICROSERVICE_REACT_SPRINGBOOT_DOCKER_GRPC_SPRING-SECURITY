import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import "../styles/ServicesPage.css";
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const ServicesPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // For modal visibility
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    // Fetch the vehicle data from the Spring Boot backend
    Axios.get("http://localhost:8080/bookings/getVehicles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }, // Backend endpoint to fetch vehicles
    })
      .then((response) => {
        setVehicles(response.data); // Set the fetched data to state
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching vehicles.");
        setLoading(false);
      });
  }, []);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    console.log(formattedDate);
    fetchAvailableTimeSlots(encodeURIComponent(formattedDate));
  };

  const fetchAvailableTimeSlots = async (date) => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `http://localhost:8080/timeslots?serviceDate=${date}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (Array.isArray(response.data)) {
        setTimeSlots(response.data);
        console.log(response.data);
      } else {
        setTimeSlots([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        "There was an issue fetching the time slots. Please try again."
      );
    }
  };
  useEffect(() => {
    Axios.get("http://localhost:8080/bookings/services", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setServices(response.data); // Set the fetched data to state
        console.log(response.data);
      })
      .catch((error) => {
        setError("Error fetching services.");
        setLoading(false);
      });
  }, []);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true); // Open the modal when a slot is selected
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) {
      toast.error("Please select a service.");
      return;
    }
    if (!selectedVehicle) {
      toast.error("Please select a vehicle.");
      return;
    }

    setLoading(true);
    const slotId = selectedSlot.slotId;
    const serviceId = selectedService.serviceId;
    const serviceName = selectedService.serviceName;
    const vehicleNo = selectedVehicle; // Using the selected vehicle number
    const bookingDate = selectedDate;
    try {
      const response = await Axios.post(
        `http://localhost:8080/bookings/createBooking`,
        { slotId, serviceId, serviceName, vehicleNo, bookingDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedTimeSlots = timeSlots.map((slot) => {
        if (slot.slotId === selectedSlot.slotId) {
          return { ...slot, availableCount: slot.availableCount - 1 };
        }
        return slot;
      });
      setTimeSlots(updatedTimeSlots);
      toast.success(`Booking confirmed for ${selectedService.serviceName}`);
      setShowModal(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        toast.error(
          "You have already booked this service within 3 days for the same vehicle."
        );
      } else {
        toast.error(
          "There was an issue confirming your booking. Please try again."
        );
      }
    }
  };

  const handleBookingCancel = () => {
    setShowModal(false); // Close the modal when cancel is clicked
  };

  const correctedStartTime = (startTime) => {
    return startTime.slice(0, 5); // Keep only the first 5 characters (HH:mm)
  };

  const correctedEndTime = (endTime) => {
    return endTime.slice(0, 5); // Keep only the first 5 characters (HH:mm)
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of the day

  return (
    <div className="serviceHome" style={{ marginTop: "60px", height: "90vh" }}>
      <NavBar />
      <Container>
        {/* Toast Container for displaying toast notifications */}
        <ToastContainer />
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              Select a Date for Your Service
            </h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select a date"
              className="form-control"
              withPortal
              minDate={new Date(today.setDate(today.getDate() + 1))} // Disable today and past dates
            />
          </Col>
        </Row>

        {selectedDate && (
          <Row className="services-list mt-4">
            {timeSlots.length > 0 ? (
              timeSlots.map((timeSlot) => (
                <Col md={4} key={timeSlot.slotId}>
                  <div className="service-card">
                    <h4>{timeSlot.serviceDate}</h4>
                    <h5>
                      {correctedStartTime(timeSlot.serviceStartTime)} -{" "}
                      {correctedEndTime(timeSlot.serviceEndTime)}{" "}
                    </h5>
                    <p>Available spaces: {timeSlot.availableCount}</p>
                    <Button
                      variant="primary"
                      onClick={() => handleSlotClick(timeSlot)} // Open modal when clicked
                    >
                      Book Now
                    </Button>
                  </div>
                </Col>
              ))
            ) : (
              <p>No services available for this date.</p>
            )}
          </Row>
        )}
      </Container>

      {/* Custom Modal for booking */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <h6
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "5px",
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                {selectedSlot && selectedSlot.serviceDate} from{" "}
                {correctedStartTime(selectedSlot.serviceStartTime)} to{" "}
                {correctedEndTime(selectedSlot.serviceEndTime)}{" "}
              </h6>
            </div>
            <div className="custom-modal-body">
              <select
                onChange={(e) => setSelectedVehicle(e.target.value)}
                value={selectedVehicle || ""}
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicleNo} value={vehicle.vehicleNo}>
                    {vehicle.vehicleNo}
                  </option>
                ))}
              </select>
            </div>
            <div className="custom-modal-body">
              <select
                onChange={(e) =>
                  setSelectedService(services[e.target.selectedIndex])
                }
              >
                <option>select the service type</option>
                {services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>
            <div className="custom-modal-footer">
              <button className="cancel-btn" onClick={handleBookingCancel}>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleConfirmBooking}
                disabled={!selectedService || !selectedVehicle} // Disable the button if any field is missing
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
