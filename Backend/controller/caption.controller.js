import CaptionModel from "../models/caption.model.js";
import blackList from "../models/blackListToken.model.js";

export const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { fullname, email, password, vehicle } = req.body;
        
        // Validate that all required fields are provided
        if (!fullname || !email || !password || !vehicle) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
            return res.status(400).json({ message: "All vehicle fields are required" });
        }
        console.log(vehicle);
        const hashPassword = await CaptionModel.hashPassword(password);
           const newUser = await CaptionModel.create({
            fullname,
            email,
            password: hashPassword,
            vehicle,
           
        });

        // Generate an authentication token
        const token = newUser.generateAuthToken();

        // Respond with token and user data
        res.status(200).json({ token, user: newUser });
    } catch (error) {
        console.error("Registration Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find the user by email (case insensitive)
        const captain = await CaptionModel
            .findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } })
            .select('+password');

        if (!captain) {
            return res.status(404).json({ message: "User not found. Please create an account." });
        }

        console.log("Password in DB: ", captain.password);

        // Compare the password
        const isMatch = await captain.comparePassword(password);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate an authentication token
        const token = captain.generateAuthToken();

        // Respond with token and user data
        return res.status(200).json({ token, message: "Sign in successful", captain});
    } catch (error) {
        console.error("Signin Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserProfile = (req, res) => {
    try {
        console.log(req.captain); // Logging user data
        return res.status(200).json(req.captain);
    } catch (error) {
        console.error("Profile Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Clear the cookie and blacklist the token
        res.clearCookie('token');
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Blacklist the token
        await blackList.create({ token });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
