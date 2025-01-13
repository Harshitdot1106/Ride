import React, { useState } from 'react';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import CaptionLogn from './pages/CaptionLogn';
import CaptionSignUp from './pages/CaptionSignUp';
import UserSignUp from './pages/UserSignUp';
import { Route, Routes } from 'react-router-dom';
import CaptainHome from './pages/CaptionHome';
import Riding from './pages/Riding';
import UserProtectWrapper from './pages/UserProtectedWrapper';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import io from 'socket.io-client';
import Start from './pages/Start.jsx';
console.log('hi');
const App = () => {
  const [user, setUser] = useState(null);
  const [captain,setCaptain]=useState(null)
   // State for managing user data
  const socket = io('http://localhost:4000'); // Initialize the socket connection

  return (
    <div>
      <Routes>
      <Route path="/" element={<Start />} />
        <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
        <Route path="/user-signup" element={<UserSignUp setUser={setUser} />} />
        <Route path="/caption-login" element={<CaptionLogn setCaptain={setCaptain} />} />
        <Route path="/caption-signup" element={<CaptionSignUp setCaptain={setCaptain} />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <UserProtectWrapper user={user} setUser={setUser}>
              <Home socket={socket} />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/riding"
          element={
            <UserProtectWrapper user={user} setUser={setUser}>
              <Riding socket={socket} />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectWrapper captain={captain} setCaptain={setCaptain}>
            <CaptainHome captain={captain} setCaptain={setCaptain}/>
            {console.log(captain)};
        </CaptainProtectWrapper>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Home socket={socket} />} />
      </Routes>
    </div>
  );
};

export default App;
