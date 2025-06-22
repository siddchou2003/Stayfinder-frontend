import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    // Form input states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    // Ensure a role is selected before proceeding
    if (!role) {
      alert('Please select a role');
      return;
    }

    try {
      // Send registration data to backend API
      await axios.post('http://localhost:3000/api/auth/register', { name, email, password, role });

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      // Show error message from server or a generic one
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2 rounded" required>
        <option value="">Select Role</option>
        <option value="seller">Host</option>
        <option value="user">Guest</option>
      </select>
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
}