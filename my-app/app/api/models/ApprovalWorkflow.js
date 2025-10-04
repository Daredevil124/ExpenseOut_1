import mongoose from 'mongoose';

const approvalWorkflowSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  workflow_type: {
    type: String,
    enum: ['sequential', 'percentage', 'hybrid'],
    default: 'sequential'
  },
  percentage_threshold: {
    type: Number,
    min: 1,
    max: 100,
    default: 100
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
approvalWorkflowSchema.index({ company_id: 1, is_active: 1 });
approvalWorkflowSchema.index({ workflow_type: 1 });

// Instance method to get approval rules
approvalWorkflowSchema.methods.getApprovalRules = async function() {
  const ApprovalRule = mongoose.model('ApprovalRule');
  return await ApprovalRule.find({ workflow_id: this._id, is_active: true })
    .sort({ step_number: 1 });
};

// Instance method to get conditional approval rules
approvalWorkflowSchema.methods.getConditionalRules = async function() {
  const ConditionalApprovalRule = mongoose.model('ConditionalApprovalRule');
  return await ConditionalApprovalRule.find({ workflow_id: this._id, is_active: true });
};

// Instance method to get expenses using this workflow
approvalWorkflowSchema.methods.getExpenses = async function() {
  const Expense = mongoose.model('Expense');
  return await Expense.find({ workflow_id: this._id });
};

// Static method to create default workflows for a company
approvalWorkflowSchema.statics.createDefaultWorkflows = async function(companyId) {
  const workflows = [
    {
      company_id: companyId,
      name: 'Standard Approval Flow',
      description: 'Manager → Finance → Director',
      workflow_type: 'sequential'
    },
    {
      company_id: companyId,
      name: 'Percentage Approval Flow',
      description: '60% of approvers OR CFO approval',
      workflow_type: 'hybrid',
      percentage_threshold: 60
    }
  ];

  return await this.insertMany(workflows);
};

// Static method to find workflows by company
approvalWorkflowSchema.statics.findByCompany = function(companyId) {
  return this.find({ company_id: companyId, is_active: true }).sort({ name: 1 });
};

// Static method to find workflow by type
approvalWorkflowSchema.statics.findByType = function(companyId, workflowType) {
  return this.find({ 
    company_id: companyId, 
    workflow_type: workflowType, 
    is_active: true 
  });
};

const ApprovalWorkflow = mongoose.models.ApprovalWorkflow || mongoose.model('ApprovalWorkflow', approvalWorkflowSchema);

export default ApprovalWorkflow;
