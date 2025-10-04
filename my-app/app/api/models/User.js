// User model (Mongoose)
// Assumes mongoose is installed and dbConnect is used elsewhere
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
