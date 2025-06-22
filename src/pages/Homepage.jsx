import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch all listings and for each, also fetch active booking count
    axios.get('http://localhost:3000/api/listings')
      .then(async res => {
        // For each listing, get the active booking count via another API call
        const listingsWithCounts = await Promise.all(
          res.data.map(async listing => {
            const countRes = await axios.get(`http://localhost:3000/api/bookings/active/count/${listing._id}`);
            return {
              ...listing,
              bookingsCount: countRes.data.count // Number of active bookings
            };
          })
        );
        setListings(listingsWithCounts); // Update state with enhanced listing data
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <Link key={listing._id} to={`/listings/${listing._id}`}>
          <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <img
              src={`http://localhost:3000${listing.imageUrls?.[0] || '/placeholder.jpg'}`}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{listing.title}</h3>
              <p className="text-gray-600">{listing.location}</p>
              <p className="mt-2 font-bold">₹{listing.pricePerNight}/night</p>
              <p className="text-sm text-green-700 font-medium">{Math.max(0, listing.maxReservations - listing.bookingsCount)} Reservations left</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}