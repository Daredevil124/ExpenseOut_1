import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  employee_id: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    default: 'employee'
  }
}, { timestamp: true
});

const User = mongoose.models.User || mongoose.model('User, userSchema');

export default User;