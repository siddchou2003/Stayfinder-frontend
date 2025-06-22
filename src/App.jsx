// Import necessary modules from React Router and other components/pages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Homepage';
import ListingDetail from './pages/ListingDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/profile';
import BookingForm from './pages/BookingForm';
import PaymentPage from './pages/PaymentPage';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      {/* Global navigation bar visible on all pages */}
      <Navbar />

      {/* Page content container */}
      <main className="p-6 max-w-7xl mx-auto">
        <Routes>
          {/* Homepage showing all listings */}
          <Route path="/" element={<Home />} />

          {/* Detailed view of a single listing */}
          <Route path="/listings/:id" element={<ListingDetail />} />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile route: shows guest/host/admin dashboard based on role */}
          <Route path="/profile" element={<Profile />} />

          {/* Booking form for selected listing */}
          <Route path="/book/:listingId" element={<BookingForm />} />

          {/* Host: create a new listing */}
          <Route path="/host-listing" element={<CreateListing />} />

          {/* Dummy payment page after booking */}
          <Route path="/payment/:listingId" element={<PaymentPage />} />

          {/* Host: edit an existing listing */}
          <Route path="/listings/:id/edit" element={<EditListing />} />

          {/* Admin-only dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}