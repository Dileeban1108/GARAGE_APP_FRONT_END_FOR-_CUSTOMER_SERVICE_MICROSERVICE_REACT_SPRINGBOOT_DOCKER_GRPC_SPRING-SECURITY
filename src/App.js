import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Updated imports
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ServicePage from './components/ServicesPage'
import UserHistory from './components/UserHistoryPage'
import ProfilePage from './components/ProfilePage'
import VerificationPage from './components/VerificationPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import ResetEmailPage from './components/ResetEmailPage'
import ProtectedRoute from './routes/ProtectedRoute'; 
import AddVehicle from './components/AddVehicle';
import ViewVehicles from './components/ViewVehicles';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/resetEmail" element={<ResetEmailPage />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      <Route path="/bookedHistory" element={<ProtectedRoute element={<UserHistory />} />} />
      <Route path="/services" element={<ProtectedRoute element={<ServicePage />} />} />
      <Route path="/addVehicles" element={<ProtectedRoute element={<AddVehicle />} />} />
      <Route path="/viewVehicles" element={<ProtectedRoute element={<ViewVehicles />} />} />
        </Routes>
    </Router>
  );
}

export default App;
