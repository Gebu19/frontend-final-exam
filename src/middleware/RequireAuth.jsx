import { useUser } from '../contexts/UserProvider';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children, allowedRoles }) {
  const { user } = useUser();

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/books" replace />; // Redirect normal users away from Admin stuff
  }

  return children;
}