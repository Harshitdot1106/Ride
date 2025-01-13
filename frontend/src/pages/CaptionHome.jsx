import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import axios from 'axios';
import io from 'socket.io-client';


const CaptainHome = ({ captain, setCaptain}) => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const [ride, setRide] = useState(null);
    const [location, setLocation] = useState(null);
    const socket = io('http://localhost:4000'); 
   // const [captain, setCaptain] = useState(null);

    useEffect(() => {
        console.log('Connecting to socket...'); // Log for connecting to socket
        socket.emit('join', { userId: captain._id, userType: 'captain' });

        // Listen for location updates from the backend
        
        // Handle new ride events
        socket.on('new-ride', (data) => {
            setRide(data);
            setRidePopupPanel(true);
        });

        return () => {
            socket.off('new-ride'); // Clean up socket event listener
        };
    }, [socket]);

    // Emit socket events when captain data is available
    useEffect(() => {
        if (!captain) {
            console.log('Captain data is not available yet');
            return;
        }

        socket?.emit('join', {
            userId: captain._id,
            userType: 'captain',
        });
        socket.on('location-update', (data) => {
            if (data.userId === captain._id) {
                setLocation(data.location);
                console.log('Updated Location:', data.location);
            }})
        console.log('Captain joined the socket channel'); // Log for socket join

        // Function to emit location updates
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const locationData = {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                    };
                    console.log('Location update emitted:', locationData); // Log for location update
                    socket?.emit('update-location-captain', locationData);
                    
                },
                (error) => {
                    if (error.code === 1) {
                        // User denied geolocation access
                        console.error('Geolocation access denied');
                        alert('Geolocation access denied. Please enable location services.');
                    } else {
                        // Handle other geolocation errors
                        console.error('Geolocation error:', error);
                    }
                }
            );
            
            }
            else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        const locationInterval = setInterval(updateLocation, 10000000); // Update every 10 seconds
        updateLocation(); // Initial location update

        return () => { 
            console.log('Clearing location interval');
            clearInterval(locationInterval); // Clean up the interval on component unmount
            }
    }, [captain, socket]);

    async function confirmRide() {
        const response = await axios.post(
            'http://localhost:4000/rider/confirm',
            {
                rideId: ride._id,
                captainId: captain?._id,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
    }

    useEffect(() => {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' });
        } else {
            gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' });
        }
    }, [ridePopupPanel]);

    useEffect(() => {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(0)' });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, { transform: 'translateY(100%)' });
        }
    }, [confirmRidePopupPanel]);

    if (!captain) {
        return <div>Loading...</div>;
    }
    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            <div className='h-2/5 p-6'>          
                    <CaptainDetails captain={captain} />
                </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    );
}

export default CaptainHome;
