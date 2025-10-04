import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  default_currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true,
    length: 3
  },
  country_code: {
    type: String,
    uppercase: true,
    length: 3
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ is_active: 1 });

// Virtual for currency symbol
companySchema.virtual('currency_symbol').get(function() {
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'INR': '₹'
  };
  return currencySymbols[this.default_currency] || this.default_currency;
});

// Static method to create company with admin user
companySchema.statics.createCompanyWithAdmin = async function(companyData, adminUserData) {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Create company
      const company = new this(companyData);
      await company.save({ session });
      
      // Create admin user
      const User = mongoose.model('User');
      const adminUser = new User({
        company_id: company._id,
        ...adminUserData,
        role: 'admin',
        is_manager_approver: true
      });
      await adminUser.save({ session });
      
      return { company, adminUser };
    });
  } finally {
    await session.endSession();
  }
};

// Instance method to get all users in company
companySchema.methods.getUsers = async function() {
  const User = mongoose.model('User');
  return await User.find({ company_id: this._id, is_active: true });
};

// Instance method to get managers in company
companySchema.methods.getManagers = async function() {
  const User = mongoose.model('User');
  return await User.findManagers(this._id);
};

// Instance method to get expenses in company
companySchema.methods.getExpenses = async function() {
  const Expense = mongoose.model('Expense');
  return await Expense.find({ company_id: this._id });
};

// Instance method to get expense categories
companySchema.methods.getExpenseCategories = async function() {
  const ExpenseCategory = mongoose.model('ExpenseCategory');
  return await ExpenseCategory.find({ company_id: this._id, is_active: true });
};

// Instance method to get approval workflows
companySchema.methods.getApprovalWorkflows = async function() {
  const ApprovalWorkflow = mongoose.model('ApprovalWorkflow');
  return await ApprovalWorkflow.find({ company_id: this._id, is_active: true });
};

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
