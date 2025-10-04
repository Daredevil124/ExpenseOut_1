// RelationshipManager model (Mongoose)
// Assumes mongoose is installed and dbConnect is used elsewhere
import mongoose from 'mongoose';

const RelationshipManagerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  manager: { type: String },
  email: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.RelationshipManager || mongoose.model('RelationshipManager', RelationshipManagerSchema);
