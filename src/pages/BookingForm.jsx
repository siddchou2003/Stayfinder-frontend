import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function BookingForm() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Fetch listing details on component mount
  useEffect(() => {
    axios.get(`http://localhost:3000/api/listings/${listingId}`)
      .then(res => setListing(res.data))
      .catch(err => console.error("Failed to fetch listing:", err));
  }, [listingId]);

  // Recalculate total price whenever dates or listing change
  useEffect(() => {
    if (startDate && endDate && listing) {
      const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
      setTotalPrice(days * listing.pricePerNight);
    }
  }, [startDate, endDate, listing]);

  // On form submit, navigate to the payment page with booking details
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/payment/${listing._id}`, {
      state: {
        startDate,
        endDate,
        totalPrice,
        checkInTime,
        checkOutTime
      }
    });
  };

  // Require login to access booking
  if (!isLoggedIn) return <p className="text-center mt-6 text-red-500">Please log in to book a stay.</p>;

  // Show loading state until listing data is fetched
  if (!listing) return <p className="text-center mt-6">Loading listing...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p>{listing.location}</p>
      <p className="text-gray-700">{listing.description}</p>
      <p>₹{listing.pricePerNight} per night</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Check-in Time</label>
            <input
              type="time"
              value={checkInTime}
              onChange={e => setCheckInTime(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block">Check-out Time</label>
            <input
              type="time"
              value={checkOutTime}
              onChange={e => setCheckOutTime(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        {totalPrice > 0 && (
          <p className="font-semibold">Total: ₹{totalPrice}</p>
        )}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}