import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/?auth=login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/?auth=login" replace />;
  }

  return children;
};

export default ProtectedRoute;
