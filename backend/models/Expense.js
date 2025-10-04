import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseCategory',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    length: 3
  },
  expense_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  current_approver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  current_step: {
    type: Number,
    default: 1
  },
  workflow_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovalWorkflow',
    default: null
  },
  is_manager_approval_required: {
    type: Boolean,
    default: true
  },
  manager_approved: {
    type: Boolean,
    default: false
  },
  manager_approved_at: {
    type: Date,
    default: null
  },
  manager_comments: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  final_approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  final_approved_at: {
    type: Date,
    default: null
  },
  rejected_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejected_at: {
    type: Date,
    default: null
  },
  rejection_reason: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes for better performance
expenseSchema.index({ company_id: 1 });
expenseSchema.index({ user_id: 1 });
expenseSchema.index({ category_id: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ current_approver_id: 1 });
expenseSchema.index({ expense_date: -1 });
expenseSchema.index({ created_at: -1 });

// Virtual for formatted amount
expenseSchema.virtual('formatted_amount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for status display
expenseSchema.virtual('status_display').get(function() {
  const statusMap = {
    'pending': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware to set current approver
expenseSchema.pre('save', async function(next) {
  if (this.isNew && this.is_manager_approval_required) {
    // Get user's manager
    const User = mongoose.model('User');
    const user = await User.findById(this.user_id);
    if (user && user.manager_id) {
      this.current_approver_id = user.manager_id;
    }
  }
  next();
});

// Instance method to get user details
expenseSchema.methods.getUser = async function() {
  return await this.populate('user_id', 'first_name last_name email role');
};

// Instance method to get category details
expenseSchema.methods.getCategory = async function() {
  return await this.populate('category_id', 'name code description');
};

// Instance method to get current approver details
expenseSchema.methods.getCurrentApprover = async function() {
  if (!this.current_approver_id) return null;
  return await this.populate('current_approver_id', 'first_name last_name email role');
};

// Instance method to approve expense
expenseSchema.methods.approve = async function(approverId, comments = '') {
  this.status = 'approved';
  this.final_approved_by = approverId;
  this.final_approved_at = new Date();
  
  if (this.is_manager_approval_required && !this.manager_approved) {
    this.manager_approved = true;
    this.manager_approved_at = new Date();
    this.manager_comments = comments;
  }
  
  return await this.save();
};

// Instance method to reject expense
expenseSchema.methods.reject = async function(rejectorId, reason = '') {
  this.status = 'rejected';
  this.rejected_by = rejectorId;
  this.rejected_at = new Date();
  this.rejection_reason = reason;
  
  return await this.save();
};

// Instance method to move to next approver
expenseSchema.methods.moveToNextApprover = async function(nextApproverId, nextStep) {
  this.current_approver_id = nextApproverId;
  this.current_step = nextStep;
  
  return await this.save();
};

// Static method to find expenses by user
expenseSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user_id: userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.dateFrom || options.dateTo) {
    query.expense_date = {};
    if (options.dateFrom) query.expense_date.$gte = new Date(options.dateFrom);
    if (options.dateTo) query.expense_date.$lte = new Date(options.dateTo);
  }
  
  return this.find(query).sort({ created_at: -1 });
};

// Static method to find expenses pending approval for a user
expenseSchema.statics.findPendingForApprover = function(approverId) {
  return this.find({ 
    current_approver_id: approverId, 
    status: 'pending' 
  }).sort({ created_at: -1 });
};

// Static method to find expenses by company
expenseSchema.statics.findByCompany = function(companyId, options = {}) {
  const query = { company_id: companyId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.userId) {
    query.user_id = options.userId;
  }
  
  if (options.categoryId) {
    query.category_id = options.categoryId;
  }
  
  return this.find(query).sort({ created_at: -1 });
};

// Static method to get expense statistics
expenseSchema.statics.getExpenseStats = async function(companyId, options = {}) {
  const matchStage = { company_id: new mongoose.Types.ObjectId(companyId) };
  
  if (options.dateFrom || options.dateTo) {
    matchStage.expense_date = {};
    if (options.dateFrom) matchStage.expense_date.$gte = new Date(options.dateFrom);
    if (options.dateTo) matchStage.expense_date.$lte = new Date(options.dateTo);
  }
  
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ];
  
  return await this.aggregate(pipeline);
};

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export default Expense;
