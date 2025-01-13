import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children, user, setUser }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/user-login'); // Redirect to login if no token is found
            return;
        }

        axios.get('http://localhost:4000/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    setUser(response.data); // Set the user data in the parent component
                    setIsLoading(false); // Loading is complete
                }
            })
            .catch((err) => {
                console.error('Authentication error:', err);
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/user-login'); // Redirect to login
            });
    }, [token, navigate, setUser]);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while verifying the user
    }

    return <>{children}</>; // Render children (protected components) if authenticated
};

export default UserProtectWrapper;
