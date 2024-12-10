import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios"; // Make sure axios is installed
import "../styles/UserHistoryPage.css"; // Optional: Add custom styles
import NavBar from "./NavBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

const UserHistoryPage = () => {
  const [bookings, setBookings] = useState([]); // State to store booking data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State to handle errors
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [bookingIdToRemove, setBookingIdToRemove] = useState(null); // Store bookingId to remove

  const correctedDate = (date) => {
    // Parse the date string into a Date object
    const parsedDate = new Date(date);

    // Add one day to the date
    parsedDate.setDate(parsedDate.getDate());

    // Format the date to 'YYYY-MM-DD' format (optional)
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    // Return the corrected date in 'YYYY-MM-DD' format
    return `${year}-${month}-${day}`;
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/bookings/getBookings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings(response.data); // Store fetched bookings in state
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load booking history.");
    } finally {
      setLoading(false); // Set loading to false once the request is done
    }
  };
  useEffect(() => {
    const intervalId = setInterval(fetchBookings, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Loading booking history...</p>
      </div>
    );
  }

  const handleRemoveBooking = () => {
    axios
      .delete(
        `http://localhost:8080/bookings/deleteBooking/${bookingIdToRemove}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setBookings(
          bookings.filter((booking) => booking.bookingId !== bookingIdToRemove)
        );
        toast.success("Booking removed successfully!");
        setShowModal(false);
      })
      .catch((error) => {
        toast.error("Error removing booking!");
        setShowModal(false); // Close the modal
      });
  };

  const handleCancelRemoveBooking = () => {
    setShowModal(false); // Close the modal if the user cancels the removal
  };

  const openModal = (bookingId) => {
    setBookingIdToRemove(bookingId); // Store the bookingId for removal
    setShowModal(true); // Show the modal
  };

  return (
    <div className="add-vehicles">
      <NavBar />
      <ToastContainer />

      <Container fluid="md">
        <Row className="justify-content-center text-center">
          <Col md={8} xs={12}>
            <h2 style={{ textAlign: "center" }}>Booking History</h2>

            {/* Show error message if fetching fails */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive="sm">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Vehicle No</th>
                  <th>Vehicle Brand</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7">No bookings found</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.serviceName}</td>
                      <td>{booking.vehicleNo}</td>
                      <td>{booking.vehicleBrand}</td>
                      <td>{correctedDate(booking.bookingDate)}</td>
                      <td
                        style={{
                          color:
                            booking.serviceAcceptStatus === "PENDING"
                              ? "orange"
                              : booking.serviceAcceptStatus === "ACCEPTED"
                              ? "green"
                              : "red",
                        }}
                      >
                        {booking.serviceAcceptStatus}
                      </td>
                      <td style={{ color: "#0080ff" }}>
                        {booking.rejectionMessage}
                      </td>{" "}
                      {/* Display the reason */}
                      <td>
                        {booking.serviceAcceptStatus !== "ACCEPTED" && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => openModal(booking.bookingId)}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to remove this Booking?</h3>
            <div className="modal-actions">
              <button onClick={handleRemoveBooking}>Confirm</button>
              <button onClick={handleCancelRemoveBooking}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistoryPage;
