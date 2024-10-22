import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};