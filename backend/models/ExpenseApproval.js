import mongoose from 'mongoose';

const expenseApprovalSchema = new mongoose.Schema({
  expense_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    required: true
  },
  approver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  step_number: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    required: true
  },
  comments: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  approved_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
expenseApprovalSchema.index({ expense_id: 1 });
expenseApprovalSchema.index({ approver_id: 1 });
expenseApprovalSchema.index({ status: 1 });
expenseApprovalSchema.index({ step_number: 1 });

// Pre-save middleware to set approved_at when status changes to approved
expenseApprovalSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.approved_at) {
    this.approved_at = new Date();
  }
  next();
});

// Instance method to get approver details
expenseApprovalSchema.methods.getApprover = async function() {
  return await this.populate('approver_id', 'first_name last_name email role');
};

// Instance method to get expense details
expenseApprovalSchema.methods.getExpense = async function() {
  return await this.populate('expense_id', 'description amount currency status');
};

// Static method to find approvals by expense
expenseApprovalSchema.statics.findByExpense = function(expenseId) {
  return this.find({ expense_id: expenseId }).sort({ step_number: 1, created_at: 1 });
};

// Static method to find approvals by approver
expenseApprovalSchema.statics.findByApprover = function(approverId, status = null) {
  const query = { approver_id: approverId };
  if (status) query.status = status;
  
  return this.find(query).sort({ created_at: -1 });
};

// Static method to find pending approvals for approver
expenseApprovalSchema.statics.findPendingForApprover = function(approverId) {
  return this.find({ 
    approver_id: approverId, 
    status: 'pending' 
  }).sort({ created_at: -1 });
};

// Static method to get approval history for expense
expenseApprovalSchema.statics.getApprovalHistory = function(expenseId) {
  return this.find({ expense_id: expenseId })
    .populate('approver_id', 'first_name last_name email role')
    .sort({ step_number: 1, created_at: 1 });
};

// Static method to check if all required steps are approved
expenseApprovalSchema.statics.areAllStepsApproved = async function(expenseId) {
  const approvals = await this.find({ expense_id: expenseId });
  const pendingApprovals = approvals.filter(approval => approval.status === 'pending');
  
  return pendingApprovals.length === 0;
};

// Static method to get next pending step
expenseApprovalSchema.statics.getNextPendingStep = async function(expenseId) {
  const pendingApproval = await this.findOne({ 
    expense_id: expenseId, 
    status: 'pending' 
  }).sort({ step_number: 1 });
  
  return pendingApproval;
};

// Static method to approve expense at current step
expenseApprovalSchema.statics.approveAtStep = async function(expenseId, approverId, stepNumber, comments = '') {
  const approval = await this.findOne({
    expense_id: expenseId,
    approver_id: approverId,
    step_number: stepNumber,
    status: 'pending'
  });

  if (!approval) {
    throw new Error('Approval not found or already processed');
  }

  approval.status = 'approved';
  approval.comments = comments;
  approval.approved_at = new Date();

  return await approval.save();
};

// Static method to reject expense at current step
expenseApprovalSchema.statics.rejectAtStep = async function(expenseId, approverId, stepNumber, comments = '') {
  const approval = await this.findOne({
    expense_id: expenseId,
    approver_id: approverId,
    step_number: stepNumber,
    status: 'pending'
  });

  if (!approval) {
    throw new Error('Approval not found or already processed');
  }

  approval.status = 'rejected';
  approval.comments = comments;

  return await approval.save();
};

const ExpenseApproval = mongoose.models.ExpenseApproval || mongoose.model('ExpenseApproval', expenseApprovalSchema);

export default ExpenseApproval;
