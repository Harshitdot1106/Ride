import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const captainModel = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters']
    },
    lastname: {
      type: String,
      minlength: [3, 'Last name must be at least 3 characters']
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, 'Color must be at least 3 characters']
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, 'Plate must be at least 3 characters']
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be more than 0']
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ['car', 'bike', 'auto']
    }
  },
  location: {
    ltd: {
      type: Number,
    },
    lng: {
      type: Number
    }
  }
});

// Method to generate JWT
captainModel.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

// Method to compare passwords
captainModel.methods.comparePassword = async function(password) {
  try {
    if (!password || !this.password) {
      throw new Error("Password data is missing");
    }
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (err) {
    console.log("Error Comparing Password", err);
    throw new Error("Error comparing passwords");
  }
};

// Static method to hash passwords
captainModel.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

const CaptainModel = mongoose.model('captain', captainModel);

export default CaptainModel;
