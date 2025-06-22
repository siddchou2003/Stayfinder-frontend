// Import user role context and the corresponding profile components
import { useAuth } from '../context/AuthContext';
import HostProfile from './HostProfile';
import GuestProfile from './GuestProfile';
import AdminDashboard from './AdminDashboard';

export default function Profile() {
  // Access the current user's role from AuthContext
  const { role } = useAuth();

  // Log role for debugging (can be removed in production)
  console.log("Current role:", role);

  // Conditionally render the appropriate dashboard based on user role
  if (role === 'seller') return <HostProfile />;
  if (role === 'user') return <GuestProfile />;
  if (role === 'admin') return <AdminDashboard />;

  // Fallback message if role is unknown or missing
  return <p className="text-center mt-10 text-red-500">Invalid or unknown role.</p>;
}