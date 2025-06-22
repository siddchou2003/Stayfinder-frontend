import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function GuestProfile() {
  const { isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ongoing');

  // Fetch user's bookings on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:3000/api/bookings/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBookings(res.data))
      .catch(err => console.error("Failed to fetch bookings:", err));
  }, []);

  const now = new Date();

  // Filter bookings based on current tab and date
  const filteredBookings = bookings.filter(booking => {
    const status = booking.status?.toLowerCase()?.trim();
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    switch (filter) {
      case 'ongoing':
        return status === 'confirmed' && start <= now && end >= now;
      case 'upcoming':
        return status === 'confirmed' && start > now;
      case 'completed':
        return status === 'completed';
      case 'cancelled':
        return status === 'cancelled';
      case 'expired':
        return status === 'expired';
      default:
        return false;
    }
  });

  // Handle booking cancellation
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update booking status in state
      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (err) {
      console.error("Cancellation failed:", err);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="flex mt-8 max-w-6xl mx-auto">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-gradient-to-b from-orange-400 to-red-500 text-white rounded-l-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">Guest Dashboard</h2>
        {['ongoing', 'upcoming', 'completed', 'cancelled', 'expired'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`w-full text-left px-4 py-2 rounded ${
              filter === tab ? 'bg-white text-orange-600 font-bold' : 'hover:bg-orange-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="flex-1 bg-white shadow p-6 rounded-r-md">
        <h2 className="text-2xl font-bold mb-4 capitalize">{filter} Bookings</h2>
        {filteredBookings.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Listing</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Check-in</th>
                <th className="p-2">Check-out</th>
                <th className="p-2">Price</th>
                {filter === 'upcoming' && <th className="p-2">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{b.listing?.title || 'N/A'}</td>
                  <td className="p-2">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(b.endDate).toLocaleDateString()}</td>
                  <td className="p-2">{b.checkInTime}</td>
                  <td className="p-2">{b.checkOutTime}</td>
                  <td className="p-2">₹{b.totalPrice}</td>
                  {filter === 'upcoming' && b.status === 'confirmed' && (
                    <td className="p-2">
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No {filter} bookings found.</p>
        )}
      </div>
    </div>
  );
}