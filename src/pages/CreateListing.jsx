import { useState } from 'react';
import axios from 'axios';

export default function CreateListing() {
  // State to manage form fields and image uploads
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerNight: '',
    location: '',
    maxReservations: '',
    checkInTime: '',
    checkOutTime: '',
    imageFile: null,
  });

  // Handle text and number input changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = new FormData();

    // Append all text-based form fields
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('location', formData.location);
    form.append('pricePerNight', formData.pricePerNight);
    form.append('maxReservations', formData.maxReservations);
    form.append('checkInTime', formData.checkInTime);
    form.append('checkOutTime', formData.checkOutTime);

    // Append selected image files (if any)
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img) => {
        form.append("images", img);
      });
    }

    try {
      // Send POST request to backend with form data
      await axios.post('http://localhost:3000/api/listings', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Listing created successfully');
    } catch (err) {
      console.error('Failed to create listing:', err);
      alert('Listing creation failed. Please check your input.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">Host a New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows="3"
          required
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Price per Night (₹)"
          value={formData.pricePerNight}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="maxReservations"
          placeholder="Max number of bookings"
          value={formData.maxReservations}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, images: Array.from(e.target.files) }))
          }
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Host Listing
        </button>
      </form>
    </div>
  );
}