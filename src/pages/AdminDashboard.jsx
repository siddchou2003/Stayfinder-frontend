import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  // State to store listings and bookings data
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  const token = localStorage.getItem('token');

  // Fetch all listings and unique users with bookings
  useEffect(() => {
    if (!token) return;

    // Fetch all listings
    axios.get('http://localhost:3000/api/admin/listings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setListings(res.data))
      .catch(err => console.error('Error fetching listings:', err));

      // Fetch all bookings and extract unique users
    axios.get('http://localhost:3000/api/admin/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const uniqueUsers = [];
        const seen = new Set();

        // Filter users to avoid duplicates
        res.data.forEach(b => {
          if (b.user && !seen.has(b.user._id)) {
            seen.add(b.user._id);
            uniqueUsers.push(b.user);
          }
        });

        setUsers(uniqueUsers);
      })
      .catch(err => console.error('Error fetching bookings:', err));
  }, []);

  // Fetch bookings for selected user
  useEffect(() => {
    if (!selectedUser) return;

    axios.get(`http://localhost:3000/api/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const filtered = res.data.filter(b => b.user?._id === selectedUser._id);
        setUserBookings(filtered);
      })
      .catch(err => console.error('Error fetching user bookings:', err));
  }, [selectedUser]);

  return (
    <div className="max-w-7xl mx-auto mt-8 space-y-10">
      {/* Listings Section */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3">
          <h2 className="text-xl font-semibold">All Listings</h2>
        </div>
        <div className="flex h-[400px]">
          <div className="w-64 overflow-y-auto bg-blue-100 p-4 space-y-2">
            {listings.length > 0 ? listings.map(listing => (
              <button
                key={listing._id}
                onClick={() => setSelectedListing(listing)}
                className={`block w-full text-left px-3 py-2 rounded ${selectedListing?._id === listing._id ? 'bg-blue-300 font-semibold' : 'hover:bg-blue-200'}`}
              >
                {listing.title}
              </button>
            )) : <p>No listings found.</p>}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {selectedListing ? (
              <div className="space-y-4">
                {selectedListing.imageUrls?.length > 0 && (
                  <img
                    src={`http://localhost:3000${selectedListing.imageUrls[0]}`}
                    alt={selectedListing.title}
                    className="w-full max-w-md h-auto object-cover rounded shadow"
                  />
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{selectedListing.title}</h3>
                  <p><strong>Description:</strong> {selectedListing.description}</p>
                  <p><strong>Price per night:</strong> ₹{selectedListing.pricePerNight}</p>
                  <p><strong>Location:</strong> {selectedListing.location}</p>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm("Are you sure you want to delete this listing?");
                      if (!confirmed) return;

                      try {
                        await axios.delete(`http://localhost:3000/api/admin/listings/${selectedListing._id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        setListings(prev => prev.filter(l => l._id !== selectedListing._id));
                        setSelectedListing(null);
                        alert("Listing deleted successfully.");
                      } catch (err) {
                        console.error("Failed to delete listing:", err);
                        alert("Failed to delete listing.");
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete Listing
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Select a listing to view details.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="bg-green-600 text-white px-4 py-3">
          <h2 className="text-xl font-semibold">All Bookings</h2>
        </div>
        <div className="flex h-[400px]">
          <div className="w-64 overflow-y-auto bg-green-100 p-4 space-y-2">
            {users.length > 0 ? users.map(user => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`block w-full text-left px-3 py-2 rounded ${selectedUser?._id === user._id ? 'bg-green-300 font-semibold' : 'hover:bg-green-200'}`}
              >
                {user.name}
              </button>
            )) : <p>No users with bookings.</p>}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {selectedUser ? (
              <>
                <h3 className="text-2xl font-bold mb-4">Bookings by {selectedUser.name}</h3>
                {userBookings.length > 0 ? (
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="p-2">Listing</th>
                        <th className="p-2">Start</th>
                        <th className="p-2">End</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBookings.map(b => (
                        <tr key={b._id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{b.listing?.title || 'Deleted Listing'}</td>
                          <td className="p-2">{new Date(b.startDate).toLocaleDateString()}</td>
                          <td className="p-2">{new Date(b.endDate).toLocaleDateString()}</td>
                          <td className="p-2 capitalize">{b.status}</td>
                          <td className="p-2">
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              onClick={async () => {
                                const confirmed = window.confirm("Are you sure you want to delete this booking?");
                                if (!confirmed) return;

                                try {
                                  await axios.delete(`http://localhost:3000/api/admin/bookings/${b._id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  setUserBookings(prev => prev.filter(book => book._id !== b._id));
                                  alert("Booking deleted successfully.");
                                } catch (err) {
                                  console.error("Failed to delete booking:", err);
                                  alert("Failed to delete booking.");
                                }
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600">No bookings by this user.</p>
                )}
              </>
            ) : (
              <p className="text-gray-600">Select a user to view their bookings.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
