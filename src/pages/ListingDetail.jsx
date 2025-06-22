import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ListingDetail() {
  // Get the dynamic listing ID from the URL
  const { id } = useParams();

  // React Router hook to programmatically navigate
  const navigate = useNavigate();

  // Get user authentication state
  const { isLoggedIn } = useAuth();

  // Local state to store listing data and booking stats
  const [listing, setListing] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [availableSlots, setAvailableSlots] = useState(null);

  // Fetch the listing details based on ID
  useEffect(() => {
    axios.get(`http://localhost:3000/api/listings/${id}`)
      .then(res => setListing(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Fetch total bookings count (used optionally if needed elsewhere)
  useEffect(() => {
    axios.get(`http://localhost:3000/api/bookings/count/${id}`)
      .then(res => setBookingCount(res.data.count))
      .catch(err => console.error("Booking count fetch error:", err));
  }, [id]);

  // Once listing is loaded, fetch number of active bookings for it
  useEffect(() => {
  if (listing) {
    axios
      .get(`http://localhost:3000/api/bookings/active/count/${listing._id}`)
      .then((res) => {
        setActiveBookings(res.data.count);
        setAvailableSlots(listing.maxReservations - res.data.count);
      })
      .catch((err) => {
        console.error("Failed to fetch active booking count:", err);
      });
  }
}, [listing]);

  // Show loading while the listing is being fetched
  if (!listing) return <p>Loading...</p>;

  // Calculate and cap available reservations at minimum 0
  const reservationsLeft = Math.max(0, listing.maxReservations - activeBookings);

  return (
    <div className="space-y-4">
      {listing.imageUrls?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listing.imageUrls?.map((url, index) => (
            <img
              key={index}
              src={`http://localhost:3000${url}`}
              alt={`Image ${index + 1}`}
              className="w-full h-60 object-cover rounded shadow"
            />
          ))}
        </div>
      )}
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="text-gray-700">{listing.description}</p>
      <p className="font-semibold">Location: {listing.location}</p>
      <p className="font-semibold">Price: ₹{listing.pricePerNight}/night</p>
      <p className="text-green-600 font-semibold">{reservationsLeft} Reservations left</p>
      <p className="text-sm text-gray-500">({activeBookings} currently reserved)</p>

      {isLoggedIn ? (
        reservationsLeft > 0 ? (
          <button
            onClick={() => navigate(`/book/${listing._id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Book Now
          </button>
        ) : (
          <p className="text-red-500 font-semibold">All rooms booked</p>
        )
      ) : (
        <p className="text-red-500">
          Please <a href="/login" className="underline">log in</a> to book.
        </p>
      )}
    </div>
  );
}