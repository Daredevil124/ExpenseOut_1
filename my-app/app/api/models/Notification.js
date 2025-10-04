import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: [
      'expense_approval_request',
      'expense_approved',
      'expense_rejected',
      'expense_submitted',
      'manager_assigned',
      'workflow_updated'
    ],
    required: true
  },
  related_expense_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    default: null
  },
  is_read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user_id: 1 });
notificationSchema.index({ is_read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ created_at: -1 });

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.is_read = true;
  return await this.save();
};

// Instance method to get related expense details
notificationSchema.methods.getRelatedExpense = async function() {
  if (!this.related_expense_id) return null;
  return await this.populate('related_expense_id', 'description amount currency status');
};

// Static method to find notifications by user
notificationSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user_id: userId };
  
  if (options.is_read !== undefined) {
    query.is_read = options.is_read;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  return this.find(query).sort({ created_at: -1 });
};

// Static method to find unread notifications for user
notificationSchema.statics.findUnreadByUser = function(userId) {
  return this.find({ user_id: userId, is_read: false }).sort({ created_at: -1 });
};

// Static method to mark all notifications as read for user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { user_id: userId, is_read: false },
    { is_read: true }
  );
};

// Static method to get notification count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ user_id: userId, is_read: false });
};

// Static method to create expense approval request notification
notificationSchema.statics.createApprovalRequest = async function(expenseId, approverId, expenseDetails) {
  const notification = new this({
    user_id: approverId,
    title: 'New Expense Approval Request',
    message: `You have a new expense approval request for ${expenseDetails.amount} ${expenseDetails.currency} from ${expenseDetails.user_name}`,
    type: 'expense_approval_request',
    related_expense_id: expenseId
  });

  return await notification.save();
};

// Static method to create expense approved notification
notificationSchema.statics.createExpenseApproved = async function(expenseId, userId, approverName) {
  const notification = new this({
    user_id: userId,
    title: 'Expense Approved',
    message: `Your expense has been approved by ${approverName}`,
    type: 'expense_approved',
    related_expense_id: expenseId
  });

  return await notification.save();
};

// Static method to create expense rejected notification
notificationSchema.statics.createExpenseRejected = async function(expenseId, userId, approverName, reason = '') {
  const message = reason 
    ? `Your expense has been rejected by ${approverName}. Reason: ${reason}`
    : `Your expense has been rejected by ${approverName}`;

  const notification = new this({
    user_id: userId,
    title: 'Expense Rejected',
    message,
    type: 'expense_rejected',
    related_expense_id: expenseId
  });

  return await notification.save();
};

// Static method to create expense submitted notification
notificationSchema.statics.createExpenseSubmitted = async function(expenseId, userId) {
  const notification = new this({
    user_id: userId,
    title: 'Expense Submitted',
    message: 'Your expense has been submitted for approval',
    type: 'expense_submitted',
    related_expense_id: expenseId
  });

  return await notification.save();
};

// Static method to create manager assigned notification
notificationSchema.statics.createManagerAssigned = async function(userId, managerName) {
  const notification = new this({
    user_id: userId,
    title: 'Manager Assigned',
    message: `${managerName} has been assigned as your manager`,
    type: 'manager_assigned'
  });

  return await notification.save();
};

// Static method to create workflow updated notification
notificationSchema.statics.createWorkflowUpdated = async function(userId, workflowName) {
  const notification = new this({
    user_id: userId,
    title: 'Approval Workflow Updated',
    message: `The approval workflow "${workflowName}" has been updated`,
    type: 'workflow_updated'
  });

  return await notification.save();
};

// Static method to cleanup old notifications
notificationSchema.statics.cleanupOldNotifications = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return await this.deleteMany({
    created_at: { $lt: cutoffDate },
    is_read: true
  });
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
