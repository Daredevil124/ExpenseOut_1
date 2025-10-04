import mongoose from 'mongoose';

const expenseCategorySchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 20
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique code per company
expenseCategorySchema.index({ company_id: 1, code: 1 }, { unique: true });
expenseCategorySchema.index({ company_id: 1, is_active: 1 });

// Static method to create default categories for a company
expenseCategorySchema.statics.createDefaultCategories = async function(companyId) {
  const defaultCategories = [
    { name: 'Travel', code: 'TRAVEL', description: 'Business travel expenses' },
    { name: 'Meals', code: 'MEALS', description: 'Business meals and entertainment' },
    { name: 'Office Supplies', code: 'OFFICE', description: 'Office supplies and equipment' },
    { name: 'Transportation', code: 'TRANS', description: 'Local transportation and parking' },
    { name: 'Accommodation', code: 'HOTEL', description: 'Hotel and accommodation expenses' },
    { name: 'Communication', code: 'COMM', description: 'Phone, internet, and communication expenses' },
    { name: 'Training', code: 'TRAIN', description: 'Training and professional development' },
    { name: 'Software', code: 'SOFT', description: 'Software licenses and subscriptions' },
    { name: 'Other', code: 'OTHER', description: 'Other business expenses' }
  ];

  const categories = defaultCategories.map(category => ({
    company_id: companyId,
    ...category
  }));

  return await this.insertMany(categories);
};

// Instance method to get expenses in this category
expenseCategorySchema.methods.getExpenses = async function() {
  const Expense = mongoose.model('Expense');
  return await Expense.find({ 
    company_id: this.company_id, 
    category_id: this._id 
  });
};

// Instance method to get expense count
expenseCategorySchema.methods.getExpenseCount = async function() {
  const Expense = mongoose.model('Expense');
  return await Expense.countDocuments({ 
    company_id: this.company_id, 
    category_id: this._id 
  });
};

// Static method to find categories by company
expenseCategorySchema.statics.findByCompany = function(companyId) {
  return this.find({ company_id: companyId, is_active: true }).sort({ name: 1 });
};

const ExpenseCategory = mongoose.models.ExpenseCategory || mongoose.model('ExpenseCategory', expenseCategorySchema);

export default ExpenseCategory;
