import axios from "axios";
const apiKey = 'AIzaSyDOe47v3QZHWVZtzLhZ8xg6yOP_aHHI5xY';
import CaptainModel from "../models/caption.model.js";
// Helper function to fetch coordinates
const fetchCoordinates = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      const lat = location.lat;
      const lng = location.lng;

      return location  // Return the coordinates if successful
    } else {
      throw new Error('No coordinates found for the given address');
    }
  } catch (err) {
    throw new Error(`Error fetching coordinates: ${err.message}`);
  }
};

// Main controller function to handle the request
const getCoordinates = async (req, res) => {
  const address = req.body.address;  // Ensure the address is coming from the request body
 // const apiKey = 'YOUR_GOOGLE_API_KEY';  // Replace with your actual API key

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });  // Validate the input address
  }

  try {
    // Call the helper function to fetch coordinates
    const location = await fetchCoordinates(address, apiKey);

    // Respond with the fetched coordinates
    return res.status(200).json({
      message: 'Coordinates fetched successfully',
      coordinates: {
       location
      },
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });  // Respond with an error message
  }
};


const fetchDistanceAndDuration = async (origin, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
  
      if (response.data.status === 'OK') {
        const distance = response.data.rows[0].elements[0].distance.text;
        const duration = response.data.rows[0].elements[0].duration.text;
        return response.data.rows[0].elements[0];  // Return the distance and duration if successful
      } else {
        throw new Error('Failed to fetch distance and duration');
      }
    } catch (err) {
      throw new Error(`Error fetching distance and duration: ${err.message}`);
    }
  };
  
  // Main controller function to handle the request
  const getDistanceTime = async (req, res) => {
    const { origin, destination } = req.query;  // Get origin and destination from query parameters
  //  const apiKey = 'YOUR_GOOGLE_API_KEY';  // Replace with your actual API key
  
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });  // Validate input
    }
  
    try {
      // Call the helper function to fetch distance and duration
      const distanceTime = await fetchDistanceAndDuration(origin, destination, apiKey);
  
      // Respond with the fetched distance and duration
      return res.status(200).json({
        message: 'Distance and duration fetched successfully',
        distanceTime
             });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: err.message });  // Respond with an error message
    }
  };
  
  const fetchSuggestions = async (input, apiKey) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
  
      if (response.data.status === 'OK') {
        return response.data.predictions;  // Return the predictions if the request is successful
      } else {
        throw new Error('Error fetching suggestions from Google API');
      }
    } catch (err) {
      throw new Error(`Error fetching suggestions: ${err.message}`);  // Handle errors from the API call
    }
  };
  
  // Main controller function to handle the request
  const getSuggestion = async (req, res) => {
    const { input } = req.query;  // Access input from query parameters
   // const apiKey = 'YOUR_GOOGLE_API_KEY';  // Replace with your actual API key
  
    console.log('Received query parameters:', req.query);  // Log the query parameters for debugging
  
    if (!input) {
      // If the input is missing, return a bad request response
      return res.status(400).json({ message: 'Query parameter "input" is required.' });
    }
  
    try {
      // Call the helper function to fetch suggestions
      const predictions = await fetchSuggestions(input, apiKey);
  console.log(predictions);
      // Return the predictions if successful
      return  res.json(predictions.map(prediction => prediction.description).filter(value => value));
    } catch (err) {
      console.error('Error:', err);  // Log the error for debugging purposes
      return res.status(500).json({ message: err.message });  // Return the error message
    }
  };

  const getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km
    const captains = await CaptainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });
    return captains;


}
export {
    getCaptainsInTheRadius,
  getCoordinates,
  getDistanceTime,
  getSuggestion,
  fetchCoordinates,
  fetchDistanceAndDuration,
  fetchSuggestions
};
