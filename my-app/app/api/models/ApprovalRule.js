import mongoose from 'mongoose';

const approvalRuleSchema = new mongoose.Schema({
  workflow_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApprovalWorkflow',
    required: true
  },
  step_number: {
    type: Number,
    required: true,
    min: 1
  },
  approver_role: {
    type: String,
    enum: ['manager', 'finance', 'director', 'specific_user'],
    required: true
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
  is_required: {
    type: Boolean,
    default: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
approvalRuleSchema.index({ workflow_id: 1, step_number: 1 });
approvalRuleSchema.index({ workflow_id: 1, is_active: 1 });
approvalRuleSchema.index({ approver_role: 1 });

// Instance method to get specific approver details
approvalRuleSchema.methods.getSpecificApprover = async function() {
  if (!this.specific_approver_id) return null;
  return await this.populate('specific_approver_id', 'first_name last_name email role');
};

// Instance method to check if amount falls within range
approvalRuleSchema.methods.isAmountInRange = function(amount) {
  const minAmount = parseFloat(this.min_amount.toString());
  const maxAmount = this.max_amount ? parseFloat(this.max_amount.toString()) : Infinity;
  
  return amount >= minAmount && amount <= maxAmount;
};

// Static method to find rules for workflow
approvalRuleSchema.statics.findByWorkflow = function(workflowId) {
  return this.find({ workflow_id: workflowId, is_active: true })
    .sort({ step_number: 1 });
};

// Static method to find applicable rule for amount
approvalRuleSchema.statics.findApplicableRule = function(workflowId, amount) {
  return this.findOne({
    workflow_id: workflowId,
    is_active: true,
    min_amount: { $lte: amount },
    $or: [
      { max_amount: { $gte: amount } },
      { max_amount: null }
    ]
  }).sort({ step_number: 1 });
};

// Static method to create default rules for standard workflow
approvalRuleSchema.statics.createDefaultRules = async function(workflowId) {
  const rules = [
    {
      workflow_id: workflowId,
      step_number: 1,
      approver_role: 'manager',
      min_amount: 0,
      max_amount: 1000
    },
    {
      workflow_id: workflowId,
      step_number: 2,
      approver_role: 'finance',
      min_amount: 1000.01,
      max_amount: 5000
    },
    {
      workflow_id: workflowId,
      step_number: 3,
      approver_role: 'director',
      min_amount: 5000.01,
      max_amount: null
    }
  ];

  return await this.insertMany(rules);
};

const ApprovalRule = mongoose.models.ApprovalRule || mongoose.model('ApprovalRule', approvalRuleSchema);

export default ApprovalRule;
