import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  setting_key: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  setting_value: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index to ensure unique setting key per company
systemSettingSchema.index({ company_id: 1, setting_key: 1 }, { unique: true });

// Instance method to get typed value
systemSettingSchema.methods.getTypedValue = function() {
  const value = this.setting_value;
  
  // Try to parse as JSON first
  try {
    return JSON.parse(value);
  } catch (e) {
    // If not JSON, try to parse as number
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }
    
    // Try to parse as boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Return as string
    return value;
  }
};

// Instance method to set typed value
systemSettingSchema.methods.setTypedValue = function(value) {
  if (typeof value === 'object') {
    this.setting_value = JSON.stringify(value);
  } else {
    this.setting_value = String(value);
  }
};

// Static method to get setting value
systemSettingSchema.statics.getValue = async function(companyId, key, defaultValue = null) {
  const setting = await this.findOne({ company_id: companyId, setting_key: key });
  
  if (!setting) return defaultValue;
  
  return setting.getTypedValue();
};

// Static method to set setting value
systemSettingSchema.statics.setValue = async function(companyId, key, value, description = '') {
  const setting = await this.findOneAndUpdate(
    { company_id: companyId, setting_key: key },
    { 
      setting_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      description: description || undefined
    },
    { upsert: true, new: true }
  );
  
  return setting;
};

// Static method to get all settings for company
systemSettingSchema.statics.getCompanySettings = function(companyId) {
  return this.find({ company_id: companyId }).sort({ setting_key: 1 });
};

// Static method to create default settings for company
systemSettingSchema.statics.createDefaultSettings = async function(companyId) {
  const defaultSettings = [
    {
      setting_key: 'auto_approval_limit',
      setting_value: '50.00',
      description: 'Amount below which expenses are auto-approved'
    },
    {
      setting_key: 'manager_approval_required',
      setting_value: 'true',
      description: 'Whether manager approval is required'
    },
    {
      setting_key: 'email_notifications',
      setting_value: 'true',
      description: 'Enable email notifications'
    },
    {
      setting_key: 'default_workflow_id',
      setting_value: '',
      description: 'Default approval workflow for new expenses'
    },
    {
      setting_key: 'receipt_required_threshold',
      setting_value: '25.00',
      description: 'Minimum amount requiring receipt'
    },
    {
      setting_key: 'max_receipt_file_size',
      setting_value: '10485760',
      description: 'Maximum receipt file size in bytes (10MB)'
    },
    {
      setting_key: 'allowed_receipt_formats',
      setting_value: 'jpg,jpeg,png,pdf',
      description: 'Allowed file formats for receipts'
    },
    {
      setting_key: 'expense_retention_days',
      setting_value: '2555',
      description: 'Number of days to retain expense data (7 years)'
    },
    {
      setting_key: 'budget_alert_threshold',
      setting_value: '80',
      description: 'Percentage of budget used to trigger alert'
    },
    {
      setting_key: 'approval_workflow_enabled',
      setting_value: 'true',
      description: 'Enable approval workflow'
    }
  ];

  const settings = defaultSettings.map(setting => ({
    company_id: companyId,
    ...setting
  }));

  return await this.insertMany(settings);
};

// Static method to get setting as boolean
systemSettingSchema.statics.getBooleanValue = async function(companyId, key, defaultValue = false) {
  const value = await this.getValue(companyId, key, defaultValue);
  return Boolean(value);
};

// Static method to get setting as number
systemSettingSchema.statics.getNumberValue = async function(companyId, key, defaultValue = 0) {
  const value = await this.getValue(companyId, key, defaultValue);
  return Number(value);
};

// Static method to get setting as array
systemSettingSchema.statics.getArrayValue = async function(companyId, key, defaultValue = []) {
  const value = await this.getValue(companyId, key, defaultValue);
  return Array.isArray(value) ? value : defaultValue;
};

// Static method to get setting as object
systemSettingSchema.statics.getObjectValue = async function(companyId, key, defaultValue = {}) {
  const value = await this.getValue(companyId, key, defaultValue);
  return typeof value === 'object' ? value : defaultValue;
};

const SystemSetting = mongoose.models.SystemSetting || mongoose.model('SystemSetting', systemSettingSchema);

export default SystemSetting;
