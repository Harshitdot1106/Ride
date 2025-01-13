import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = ({ setUser }) => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const showz = () => {
        setShow(!show);
    };

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password,
        };

        try {
            const response = await axios.post('http://localhost:4000/user/signin', userData);
            console.log(response.status);

            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token', data.token);
                navigate('/home');
            }

            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className='p-7 flex flex-col justify-between'>
            <div>
                <img className='w-16 mb-10' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='UBER LOGO' />
                <form onSubmit={(e)=>{
                    submitHandler(e);
                }}>
                    <h3 className='text-lg mb-2'>What's Your Email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                        type='email'
                        placeholder='@gmail.com'
                    />
                    <h3 className='text-xl mb-2'>Enter Password</h3>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='bg-[#eeeeee] mb-2 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                        type={show ? 'text' : 'password'}
                        placeholder=''
                    />
                    <button className="text-blue-500 font-semibold mb-4 hover:underline" type='button' onClick={() => { showz(); }}>
                        {show ? 'Hide Password' : 'Show Password'}
                    </button>
                    <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base' type='submit'>
                        Login
                    </button>
                    <p className='text-center'>
                        New Here?{' '}
                        <Link to='/user-signup' className='text-blue-600'>
                            Create new Account
                        </Link>
                    </p>
                </form>
            </div>
            <div>
                <button onClick={() => navigate('/caption-login')} className='bg-[#10b461] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>
                    Sign In as Caption
                </button>
            </div>
        </div>
    );
};

export default UserLogin;
