import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function HostProfile() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Fetch all listings hosted by the logged-in user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:3000/api/listings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const userListings = res.data.filter(l => l.host === JSON.parse(atob(token.split('.')[1])).userId);
        setListings(userListings);
      })
      .catch(err => console.error("Failed to fetch listings:", err));
  }, []);

  // Fetch bookings when a listing is selected
  useEffect(() => {
    if (!selectedListing) return;
    
    axios.get(`http://localhost:3000/api/bookings?listingId=${selectedListing._id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error("Failed to fetch bookings:", err));
  }, [selectedListing]);

  return (
    <div className="flex mt-8 max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-gradient-to-b from-green-400 to-blue-500 text-white rounded-l-md space-y-4">
        <h2 className="text-xl font-semibold mb-4">Host Dashboard</h2>
        {listings.length > 0 ? listings.map(listing => (
          <button
            key={listing._id}
            onClick={() => setSelectedListing(listing)}
            className={`w-full text-left px-4 py-2 rounded ${
              selectedListing?._id === listing._id ? 'bg-white text-blue-600 font-bold' : 'hover:bg-blue-300'
            }`}
          >
            {listing.title}
          </button>
        )) : (
          <p className="text-sm">No listings created.</p>
        )}
      </div>

      {/* Booking Details */}
      <div className="flex-1 bg-white shadow p-6 rounded-r-md">
        {selectedListing ? (
          <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Bookings for: {selectedListing.title}</h2>
                <div className="space-x-2">
                    <Link
                        to={`/listings/${selectedListing._id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={async () => {
                            const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
                            if (!confirmDelete) return;

                            try {
                            const token = localStorage.getItem('token');
                            await axios.delete(`http://localhost:3000/api/listings/${selectedListing._id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            setListings(prev => prev.filter(l => l._id !== selectedListing._id));
                            setSelectedListing(null);
                            alert('Listing deleted successfully.');
                            } catch (err) {
                            console.error('Failed to delete listing:', err);
                            alert('Failed to delete listing.');
                            }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-4 rounded"
                        >
                        Delete
                    </button>
                </div>
            </div>
            {bookings.length > 0 ? (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Guest</th>
                    <th className="p-2">Start</th>
                    <th className="p-2">End</th>
                    <th className="p-2">Check-in</th>
                    <th className="p-2">Check-out</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{b.user?.name || 'Guest'}</td>
                      <td className="p-2">{new Date(b.startDate).toLocaleDateString()}</td>
                      <td className="p-2">{new Date(b.endDate).toLocaleDateString()}</td>
                      <td className="p-2">{b.checkInTime}</td>
                      <td className="p-2">{b.checkOutTime}</td>
                      <td className="p-2 capitalize">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No bookings for this listing.</p>
            )}
          </>
        ) : (
          <p className="text-gray-600">Select a listing to view its bookings.</p>
        )}
      </div>
    </div>
  );
}