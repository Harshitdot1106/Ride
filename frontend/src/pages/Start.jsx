import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
   <div className='bg-cover  bg-[url(https://cdn.pixabay.com/photo/2019/08/10/11/41/traffic-lights-4396736_1280.jpg)] h-screen pt-8  flex justify-between flex-col w-full '>
    <img className='w-14 ml-8' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='UBER LOGO'/>
    <div className='bg-white pb-7 py-5 px-4'>
      <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
      <Link to='/user-login' className='flex items-center justify-center  w-full bg-black text-white py-3 rounded mt-5'>
        Continue
      </Link>
    </div>
   </div>
  )
}

export default Start