import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for the listing fetched from server
  const [listing, setListing] = useState(null);

  // State to manage the form inputs and new images
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    pricePerNight: '',
    images: [], // holds new images (not existing ones)
    maxReservations: ''
  });

  // Fetch the listing details when component loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`http://localhost:3000/api/listings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // Populate form with fetched data
      setListing(res.data);
      setFormData({
        title: res.data.title,
        location: res.data.location,
        pricePerNight: res.data.pricePerNight,
        images: [], // images array is reset for file upload
        maxReservations: res.data.maxReservations
      });
    })
    .catch(err => {
      console.error('Failed to fetch listing:', err);
      alert('Listing not found or unauthorized');
      navigate('/host-profile');
    });
  }, [id]);

  // Handle form field updates
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = new FormData();

    form.append('title', formData.title);
    form.append('location', formData.location);
    form.append('pricePerNight', formData.pricePerNight);
    form.append('maxReservations', formData.maxReservations);

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        form.append('images', file);
      });
    }

    try {
      // Send PUT request with multipart/form-data
      await axios.put(`http://localhost:3000/api/listings/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Listing updated successfully');
      navigate('/profile');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update listing');
    }
  };

  // Show a loading message until listing is fetched
  if (!listing) return <p className="text-center mt-10 text-gray-500">Loading listing...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Price Per Night</label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={(e) => setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }))}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Max Reservations</label>
          <input
            type="number"
            name="maxReservations"
            value={formData.maxReservations}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}