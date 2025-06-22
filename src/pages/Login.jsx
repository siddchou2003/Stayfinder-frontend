import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {

  // Local state to store user inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // React Router hook for redirection after login
  const navigate = useNavigate();

  // Access login function from global AuthContext
  const { login } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Send login request to backend
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      // Destructure token and user info from response
      const { token, user } = res.data;

      // Store token and role in context + localStorage (via login method)
      login(token, user.role);

      // Redirect to homepage after successful login
      navigate('/');
    } catch (err) {
      // Show alert on login error (fallback message if no custom error)
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
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
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}