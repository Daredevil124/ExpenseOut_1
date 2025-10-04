import mongoose from 'mongoose';

const conditionalApprovalRuleSchema = new mongoose.Schema({
  workflow_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovalWorkflow',
    required: true
  },
  rule_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  rule_type: {
    type: String,
    enum: ['percentage', 'specific_approver', 'hybrid'],
    required: true
  },
  percentage_threshold: {
    type: Number,
    min: 1,
    max: 100,
    default: null
  },
  specific_approver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  min_amount: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  },
  max_amount: {
    type: mongoose.Schema.Types.Decimal128,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
conditionalApprovalRuleSchema.index({ workflow_id: 1, is_active: 1 });
conditionalApprovalRuleSchema.index({ rule_type: 1 });
conditionalApprovalRuleSchema.index({ specific_approver_id: 1 });

// Instance method to get specific approver details
conditionalApprovalRuleSchema.methods.getSpecificApprover = async function() {
  if (!this.specific_approver_id) return null;
  return await this.populate('specific_approver_id', 'first_name last_name email role');
};

// Instance method to check if amount falls within range
conditionalApprovalRuleSchema.methods.isAmountInRange = function(amount) {
  const minAmount = parseFloat(this.min_amount.toString());
  const maxAmount = this.max_amount ? parseFloat(this.max_amount.toString()) : Infinity;
  
  return amount >= minAmount && amount <= maxAmount;
};

// Instance method to check if percentage threshold is met
conditionalApprovalRuleSchema.methods.isPercentageThresholdMet = function(approvedCount, totalApprovers) {
  if (this.rule_type !== 'percentage' && this.rule_type !== 'hybrid') return false;
  if (!this.percentage_threshold) return false;
  
  const percentage = (approvedCount / totalApprovers) * 100;
  return percentage >= this.percentage_threshold;
};

// Instance method to check if specific approver has approved
conditionalApprovalRuleSchema.methods.hasSpecificApproverApproved = function(approvals) {
  if (this.rule_type !== 'specific_approver' && this.rule_type !== 'hybrid') return false;
  if (!this.specific_approver_id) return false;
  
  return approvals.some(approval => 
    approval.approver_id.toString() === this.specific_approver_id.toString() && 
    approval.status === 'approved'
  );
};

// Instance method to check if rule conditions are met
conditionalApprovalRuleSchema.methods.areConditionsMet = function(approvals, totalApprovers) {
  if (this.rule_type === 'percentage') {
    return this.isPercentageThresholdMet(approvals.length, totalApprovers);
  }
  
  if (this.rule_type === 'specific_approver') {
    return this.hasSpecificApproverApproved(approvals);
  }
  
  if (this.rule_type === 'hybrid') {
    return this.isPercentageThresholdMet(approvals.length, totalApprovers) || 
           this.hasSpecificApproverApproved(approvals);
  }
  
  return false;
};

// Static method to find rules for workflow
conditionalApprovalRuleSchema.statics.findByWorkflow = function(workflowId) {
  return this.find({ workflow_id: workflowId, is_active: true });
};

// Static method to find applicable rules for amount
conditionalApprovalRuleSchema.statics.findApplicableRules = function(workflowId, amount) {
  return this.find({
    workflow_id: workflowId,
    is_active: true,
    min_amount: { $lte: amount },
    $or: [
      { max_amount: { $gte: amount } },
      { max_amount: null }
    ]
  });
};

// Static method to create default conditional rules
conditionalApprovalRuleSchema.statics.createDefaultRules = async function(workflowId) {
  const rules = [
    {
      workflow_id: workflowId,
      rule_name: '60% Approval Rule',
      rule_type: 'percentage',
      percentage_threshold: 60,
      min_amount: 0,
      max_amount: null
    },
    {
      workflow_id: workflowId,
      rule_name: 'CFO Override Rule',
      rule_type: 'specific_approver',
      min_amount: 0,
      max_amount: null
      // specific_approver_id will be set when CFO user is created
    }
  ];

  return await this.insertMany(rules);
};

const ConditionalApprovalRule = mongoose.models.ConditionalApprovalRule || mongoose.model('ConditionalApprovalRule', conditionalApprovalRuleSchema);

export default ConditionalApprovalRule;
