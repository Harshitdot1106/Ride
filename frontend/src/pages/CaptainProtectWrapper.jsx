import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectWrapper = ({ children, captain, setCaptain }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(token);
        if (!token) {
            navigate('/caption-login'); // Redirect to login if no token is found
            return;
        }

        axios.get('http://localhost:4000/caption/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    setCaptain(response.data); // Set the captain data in the parent component
                    console.log(response.data);
                    setIsLoading(false); // Loading is complete
                }
            })
            .catch((err) => {
                console.error('Authentication error:', err);
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/caption-login'); // Redirect to login
            });
    }, [token, navigate, setCaptain]);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while verifying the captain
    }

    return <>{children}</>; // Render children (protected components) if authenticated
};

export default CaptainProtectWrapper;
