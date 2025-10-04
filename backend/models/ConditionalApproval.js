import mongoose from 'mongoose';

const conditionalApprovalSchema = new mongoose.Schema({
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
  rule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConditionalApprovalRule',
    required: true
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
conditionalApprovalSchema.index({ expense_id: 1 });
conditionalApprovalSchema.index({ approver_id: 1 });
conditionalApprovalSchema.index({ rule_id: 1 });
conditionalApprovalSchema.index({ status: 1 });

// Pre-save middleware to set approved_at when status changes to approved
conditionalApprovalSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.approved_at) {
    this.approved_at = new Date();
  }
  next();
});

// Instance method to get approver details
conditionalApprovalSchema.methods.getApprover = async function() {
  return await this.populate('approver_id', 'first_name last_name email role');
};

// Instance method to get expense details
conditionalApprovalSchema.methods.getExpense = async function() {
  return await this.populate('expense_id', 'description amount currency status');
};

// Instance method to get rule details
conditionalApprovalSchema.methods.getRule = async function() {
  return await this.populate('rule_id', 'rule_name rule_type percentage_threshold');
};

// Static method to find approvals by expense
conditionalApprovalSchema.statics.findByExpense = function(expenseId) {
  return this.find({ expense_id: expenseId }).sort({ created_at: 1 });
};

// Static method to find approvals by approver
conditionalApprovalSchema.statics.findByApprover = function(approverId, status = null) {
  const query = { approver_id: approverId };
  if (status) query.status = status;
  
  return this.find(query).sort({ created_at: -1 });
};

// Static method to find pending approvals for approver
conditionalApprovalSchema.statics.findPendingForApprover = function(approverId) {
  return this.find({ 
    approver_id: approverId, 
    status: 'pending' 
  }).sort({ created_at: -1 });
};

// Static method to get approval statistics for expense
conditionalApprovalSchema.statics.getApprovalStats = async function(expenseId) {
  const stats = await this.aggregate([
    { $match: { expense_id: new mongoose.Types.ObjectId(expenseId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  };

  stats.forEach(stat => {
    result.total += stat.count;
    result[stat._id] = stat.count;
  });

  return result;
};

// Static method to check if approval conditions are met
conditionalApprovalSchema.statics.areConditionsMet = async function(expenseId) {
  const ConditionalApprovalRule = mongoose.model('ConditionalApprovalRule');
  
  // Get all approvals for this expense
  const approvals = await this.find({ expense_id: expenseId });
  const approvedApprovals = approvals.filter(approval => approval.status === 'approved');
  
  // Get all applicable rules for this expense
  const expense = await mongoose.model('Expense').findById(expenseId);
  const rules = await ConditionalApprovalRule.findApplicableRules(expense.workflow_id, expense.amount);
  
  // Check if any rule conditions are met
  for (const rule of rules) {
    if (rule.areConditionsMet(approvedApprovals, approvals.length)) {
      return true;
    }
  }
  
  return false;
};

// Static method to approve expense under rule
conditionalApprovalSchema.statics.approveUnderRule = async function(expenseId, approverId, ruleId, comments = '') {
  const approval = await this.findOne({
    expense_id: expenseId,
    approver_id: approverId,
    rule_id: ruleId,
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

// Static method to reject expense under rule
conditionalApprovalSchema.statics.rejectUnderRule = async function(expenseId, approverId, ruleId, comments = '') {
  const approval = await this.findOne({
    expense_id: expenseId,
    approver_id: approverId,
    rule_id: ruleId,
    status: 'pending'
  });

  if (!approval) {
    throw new Error('Approval not found or already processed');
  }

  approval.status = 'rejected';
  approval.comments = comments;

  return await approval.save();
};

// Static method to get approval history for expense
conditionalApprovalSchema.statics.getApprovalHistory = function(expenseId) {
  return this.find({ expense_id: expenseId })
    .populate('approver_id', 'first_name last_name email role')
    .populate('rule_id', 'rule_name rule_type percentage_threshold')
    .sort({ created_at: 1 });
};

const ConditionalApproval = mongoose.models.ConditionalApproval || mongoose.model('ConditionalApproval', conditionalApprovalSchema);

export default ConditionalApproval;
