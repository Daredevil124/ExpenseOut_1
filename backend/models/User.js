import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password_hash: {
    type: String,
    required: true,
    minlength: 6
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  employee_id: {
    type: String,
    trim: true,
    maxlength: 20
  },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee'
  },
  is_manager_approver: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ company_id: 1 });
userSchema.index({ manager_id: 1 });
userSchema.index({ role: 1 });
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Virtual for full name
userSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

// Virtual for employees under this user (if they are a manager)
userSchema.virtual('employees', {
  ref: 'User',
  localField: '_id',
  foreignField: 'manager_id'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password_hash')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Instance method to get user's manager
userSchema.methods.getManager = async function() {
  if (!this.manager_id) return null;
  return await this.constructor.findById(this.manager_id);
};

// Instance method to get user's employees (if they are a manager)
userSchema.methods.getEmployees = async function() {
  return await this.constructor.find({ manager_id: this._id, is_active: true });
};

// Instance method to check if user can approve expenses
userSchema.methods.canApproveExpenses = function() {
  return this.role === 'admin' || this.role === 'manager' || this.is_manager_approver;
};

// Instance method to check if user can manage users
userSchema.methods.canManageUsers = function() {
  return this.role === 'admin';
};

// Instance method to check if user can configure approval rules
userSchema.methods.canConfigureApprovalRules = function() {
  return this.role === 'admin';
};

// Static method to find users by role
userSchema.statics.findByRole = function(role, companyId) {
  return this.find({ role, company_id: companyId, is_active: true });
};

// Static method to find managers in a company
userSchema.statics.findManagers = function(companyId) {
  return this.find({ 
    company_id: companyId, 
    is_active: true,
    $or: [
      { role: 'manager' },
      { is_manager_approver: true }
    ]
  });
};

// Static method to find users by manager
userSchema.statics.findByManager = function(managerId) {
  return this.find({ manager_id: managerId, is_active: true });
};

// Static method to create admin user for new company
userSchema.statics.createAdminUser = async function(companyId, userData) {
  const adminUser = new this({
    company_id: companyId,
    ...userData,
    role: 'admin',
    is_manager_approver: true
  });
  
  return await adminUser.save();
};

// Transform JSON output to remove sensitive data
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password_hash;
  return userObject;
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
