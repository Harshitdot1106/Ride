import React from 'react';

const CaptainDetails = ({ captain }) => {
   

    if (!captain) {
        return <div>No Captain Data</div>;
    }
console.log("Data is " ,captain);
    // Using optional chaining to avoid accessing undefined properties
    const firstname = captain.fullname?.firstname || "First Name Not Available";
    const lastname = captain.fullname?.lastname || "Last Name Not Available";
    
    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{`${firstname} ${lastname}`}</h4>
                </div>
                <div>
                <h4 className='text-xl font-semibold'>{`${captain.vehicle?.plate}`} </h4>
                    <h4 className='text-xl font-semibold'>{`${captain.vehicle?.vehicleType}`} </h4>
                    <p className='text-sm text-gray-600'></p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>0</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>{`${captain.vehicle?.color}`}</h5>
                    <p className='text-sm text-gray-600'>Color</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{`${captain.vehicle?.capacity}`}</h5>
                    <p className='text-sm text-gray-600'>Max Capacity</p>
                </div>
            </div>
        </div>
    );
};

export default CaptainDetails;
