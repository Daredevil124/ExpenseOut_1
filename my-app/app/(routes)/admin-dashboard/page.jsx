"use client"
import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

export default function ApprovalRulesUI() {
  const [activeRule, setActiveRule] = useState('');
  const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);
  const [approverSequence, setApproverSequence] = useState(false);
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [employee, setEmployee] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [approvers, setApprovers] = useState([{ name: '', required: false }]);
  const [minApprovalPercentage, setMinApprovalPercentage] = useState('');

  const [rules, setRules] = useState([]);
  const [managers, setManagers] = useState([]);

  const handleAddApprover = () => {
    setApprovers([...approvers, { name: '', required: false }]);
  };

  const handleRemoveApprover = (index) => {
    setApprovers(approvers.filter((_, i) => i !== index));
  };

  const handleApproverChange = (index, field, value) => {
    const updated = [...approvers];
    updated[index] = { ...updated[index], [field]: value };
    setApprovers(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin View - Approval Rules Configuration
          </h1>
        </div>

        {/* Rule Tabs */}
        <div className="flex gap-2 mb-6">
          {rules.length === 0 ? (
            <div className="text-gray-500 text-sm">No approval rules configured. Add a new rule to get started.</div>
          ) : (
            rules.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setActiveRule(rule.id)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors border-b-2 ${
                  activeRule === rule.id
                    ? `${rule.color} text-white border-transparent`
                    : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'
                }`}
              >
                {rule.name}
              </button>
            ))
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Panel - Rule Configuration */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
              <input
                type="text"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                placeholder="Enter employee name"
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Description
              </label>
              <input
                type="text"
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Enter rule description"
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Manager</label>
              <div className="relative">
                <button
                  onClick={() => setManagerDropdownOpen(!managerDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <span className={!selectedManager ? 'text-gray-400' : ''}>
                    {selectedManager || 'Select a manager'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </button>
                
                {managerDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                    {managers.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">No managers available</div>
                    ) : (
                      managers.map((manager) => (
                        <div
                          key={manager}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                          onClick={() => {
                            setSelectedManager(manager);
                            setManagerDropdownOpen(false);
                          }}
                        >
                          {manager}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Panel - Approver Configuration */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <label className="block text-sm font-medium text-gray-700">Approvers</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isManagerApprover}
                    onChange={(e) => setIsManagerApprover(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Include Manager as Approver
                </label>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {approvers.map((approver, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-gray-600 w-6 font-medium">{index + 1}</span>
                  <input
                    type="text"
                    value={approver.name}
                    onChange={(e) => handleApproverChange(index, 'name', e.target.value)}
                    placeholder="Enter approver name"
                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={approver.required}
                      onChange={(e) => handleApproverChange(index, 'required', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600 whitespace-nowrap">Required</span>
                  </div>
                  {approvers.length > 1 && (
                    <button
                      onClick={() => handleRemoveApprover(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddApprover}
              className="mb-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Approver
            </button>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={approverSequence}
                  onChange={(e) => setApproverSequence(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Sequential Approval Required
              </label>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Approval Threshold (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minApprovalPercentage}
                  onChange={(e) => setMinApprovalPercentage(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-24 bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-700">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}