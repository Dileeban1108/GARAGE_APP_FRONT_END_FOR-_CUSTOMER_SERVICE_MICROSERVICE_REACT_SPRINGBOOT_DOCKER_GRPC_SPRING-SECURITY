# Garage Application-> Customer Service- Front-End

## Project Overview

This is the front-end part of the **Garage Application** developed using **React**. The application enables customers to book services, manage profiles, and interact with the system in a seamless manner. The system is built using **microservices architecture**, where the customer service microservice communicates with other services (e.g., booking service) via **gRPC**.

The main features of the garage application include:
- **Sign-Up and Sign-In Pages** with user authentication (using JWT tokens via Spring Security).
- **Profile Management** (Edit Profile).
- **Service Booking**: Ability to view, book, and manage services.
- **Booking Status Updates**: Get real-time updates on booking status (Accepted/Rejected).
- **Filtering Services by Day**: Easily filter available services based on the date.

### Key Technologies Used
- **React** for front-end development.
- **Docker** for containerization.
- **Spring Security (JWT)** for secure authentication.
- **gRPC** for inter-service communication.
  
## Features

1. **User Authentication:**
   - **Sign-Up** page: User can create an account with validation.
   - **Sign-In** page: Secure login with JWT authentication.
  
2. **Profile Management:**
   - **Edit Profile**: Users can edit their personal information.
  
3. **Service Booking:**
   - Users can book available services, view details, and track status.
   - **Status Updates**: Booking statuses are updated in real time (Accepted/Rejected).

4. **Filtering Services:**
   - Users can filter available services by date for better service management.

5. **Dockerized Front-End:**
   - The application is containerized using **Docker**, enabling easy deployment across different environments.

## Project Setup

To get started with the project, follow these steps:

### Prerequisites

Before setting up the project, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dileeban1108/GARAGE_APP_FRONT_END_FOR-_CUSTOMER_SERVICE_MICROSERVICE_REACT_SPRINGBOOT_DOCKER_GRPC_SPRING-SECURITY.git
