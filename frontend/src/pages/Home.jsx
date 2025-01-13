import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = ({ socket }) => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);
    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [fare, setFare] = useState({});
    const [vehicleType, setVehicleType] = useState(null);
    const [ride, setRide] = useState(null);

    const navigate = useNavigate();

    // Listen for socket events
    useEffect(() => {
        console.log('Connecting to socket...');

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('ride-confirmed', (ride) => {
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(ride);
        });

        socket.on('ride-started', (ride) => {
            console.log('Ride started:', ride);
            setWaitingForDriver(false);
            navigate('/riding', { state: { ride } });
        });

        return () => {
            socket.off('ride-confirmed');
            socket.off('ride-started');
        };
    }, [socket, navigate]);

    const emitLocationUpdate = (locationData) => {
        if (socket) {
            socket.emit('update-location', locationData);
            console.log('Location update emitted:', locationData);
        }
    };

    const handlePickupChange = async (e) => {
        console.log(e.target.value);
        setPickup(e.target.value);
        try {
            const response = await axios.get('http://localhost:4000/maps/get-suggestions', {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(response.data);
            setPickupSuggestions(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value);
        try {
            const response = await axios.get('http://localhost:4000/maps/get-suggestions', {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setDestinationSuggestions(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
    };

    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24,
            });
            gsap.to(panelCloseRef.current, {
                opacity: 1,
            });
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
            });
            gsap.to(panelCloseRef.current, {
                opacity: 0,
            });
        }
    }, [panelOpen]);

    useGSAP(() => {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [vehiclePanel]);

    useGSAP(() => {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [confirmRidePanel]);

    useGSAP(() => {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [vehicleFound]);

    useGSAP(() => {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [waitingForDriver]);

    async function findTrip() {
        setVehiclePanel(true);
        setPanelOpen(false);

        const response = await axios.get('http://localhost:4000/rider/get-fare', {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }); 
        
        setFare(response.data.fare);
        console.log(response.data.fare);
    }

    async function createRide() {
        const rideData = {
            pickup,
            destination,
            vehicleType,
        };
        const response = await axios.post(`http://localhost:4000/rider/create`, rideData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        console.log(response.data);
        
        if (socket) {
            socket.emit('create-ride', rideData);
        }
    }

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='' />
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className='ri-arrow-down-wide-line'></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => submitHandler(e)}>
                        <div className='line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full'></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true);
                                setActiveField('pickup');
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type='text'
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true);
                                setActiveField('destination');
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type='text'
                            placeholder='Enter your destination'
                        />
                    </form>
                    <button onClick={findTrip} className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound}
                />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                />
            </div>
        </div>
    );
};

export default Home;
