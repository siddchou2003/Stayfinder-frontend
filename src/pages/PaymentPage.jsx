import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function PaymentPage() {
  // Grab the listing ID from the URL
  const { listingId } = useParams();

  // For redirection and getting passed state
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure booking info passed from BookingForm via route state
  const state = location.state || {};
  const { startDate, endDate, totalPrice, checkInTime, checkOutTime } = state;

  // State for listing details and form input
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  // Fetch the listing details on component mount
  useEffect(() => {
    if (!listingId) return;

    axios.get(`http://localhost:3000/api/listings/${listingId}`)
      .then(res => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch listing:", err);
        setLoading(false);
      });
  }, [listingId]);

  // Simulated/dummy payment logic
  const handleDummyPayment = async () => {
  if (!cardNumber.trim()) {
    return alert("Please enter a card number");
  }

  setPaymentProcessing(true);

  // Simulate delay (e.g., payment gateway processing)
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to complete the booking.");
        return navigate('/login');
      }

      // Create the booking (with unpaid status)
      const bookingRes = await axios.post(
        'http://localhost:3000/api/bookings',
        {
          listing: listingId,
          startDate,
          endDate,
          totalPrice,
          checkInTime,
          checkOutTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const bookingId = bookingRes.data._id;

      // Mark the booking as confirmed (simulating payment success)
      const confirmRes = await axios.patch(
        `http://localhost:3000/api/bookings/${bookingId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("✅ Confirmed booking:", confirmRes.data);

      alert("Payment successful! Booking confirmed.");

      // Navigate user to their profile after booking
      navigate('/profile');
    } catch (err) {
      console.error("❌ Payment or booking confirmation failed:", err.response?.data || err.message);
      alert("Booking failed.");
    } finally {
      setPaymentProcessing(false);
    }
  }, 2000); // Simulated delay of 2 seconds
};

  // Guard clause if required booking data is missing
  if (!startDate || !endDate || !checkInTime || !checkOutTime || !totalPrice) {
    return (
      <div className="text-center mt-10 text-red-500">
        Invalid booking details. Please start from the listing page.
      </div>
    );
  }

  // Conditional rendering during data fetch or if listing is not found
  if (loading) return <p className="text-center mt-10">Loading listing...</p>;
  if (!listing) return <p className="text-center mt-10 text-red-500">Listing not found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 text-center space-y-6">
      <h1 className="text-2xl font-bold">Confirm Payment</h1>
      <p className="text-lg">{listing.title}</p>
      <p>From <strong>{startDate}</strong> at <strong>{checkInTime}</strong></p>
      <p>To <strong>{endDate}</strong> at <strong>{checkOutTime}</strong></p>
      <p className="font-semibold">Total Price: ₹{totalPrice}</p>

      <div className="mt-6">
        <label className="block text-left font-semibold mb-1">Card Number (Dummy)</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleDummyPayment}
          disabled={paymentProcessing}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {paymentProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}