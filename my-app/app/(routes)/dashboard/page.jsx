"use client"

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, User, MessageSquare, Eye, Filter, ChevronDown, Send, ArrowRight } from 'lucide-react';
import CurrencySelector from '@/components/currency';

const ExpenseApprovalDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comment, setComment] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(['all']);
  const [userRole, setUserRole] = useState('manager'); // 'employee' or 'manager'
  const [myExpenses, setMyExpenses] = useState([]);
  const [loadingMyExpenses, setLoadingMyExpenses] = useState(false);
  const [selectedTableExpense, setSelectedTableExpense] = useState(null);
  const [tableComment, setTableComment] = useState('');
  const [currency, setCurrency] = useState(null);

  // Fetch expenses on component mount and tab change
  useEffect(() => {
    fetchExpenses();
    fetchMyExpenses();
  }, [activeTab, filterCategory, sortBy]);

  useEffect(() => {
    const fetchedCurrency = localStorage.getItem("selectedCurrency");
    const cleaned = fetchedCurrency.replace(/"|'/g, "");
    setCurrency(cleaned);
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/expenses?status=${activeTab}&category=${filterCategory}&sort=${sortBy}`);
      // const data = await response.json();
      // setExpenses(data.expenses);
      
      // Placeholder - remove when API is implemented
      setExpenses([]);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyExpenses = async () => {
    setLoadingMyExpenses(true);
    try {
      // TODO: Replace with actual API endpoint
      // For Employee: GET /api/my-expenses
      // For Manager: GET /api/my-approved-expenses
      // const response = await fetch(`/api/${userRole === 'employee' ? 'my-expenses' : 'my-approved-expenses'}`);
      // const data = await response.json();
      // setMyExpenses(data.expenses);
      
      // Placeholder - remove when API is implemented
      setMyExpenses([]);
    } catch (error) {
      console.error('Error fetching my expenses:', error);
    } finally {
      setLoadingMyExpenses(false);
    }
  };

  const handleApprove = async (expenseId) => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/expenses/${expenseId}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comment })
      // });
      // if (response.ok) {
      //   fetchExpenses();
      //   setComment('');
      //   setSelectedExpense(null);
      // }
      
      console.log(`Approving expense ${expenseId} with comment: ${comment}`);
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleReject = async (expenseId) => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/expenses/${expenseId}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comment })
      // });
      // if (response.ok) {
      //   fetchExpenses();
      //   setComment('');
      //   setSelectedExpense(null);
      // }
      
      console.log(`Rejecting expense ${expenseId} with comment: ${comment}`);
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  const handleTableAction = async (expenseId, action) => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/expenses/${expenseId}/${action}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comment: tableComment })
      // });
      // if (response.ok) {
      //   fetchMyExpenses();
      //   setTableComment('');
      //   setSelectedTableExpense(null);
      // }
      
      console.log(`${action} expense ${expenseId} with comment: ${tableComment}`);
      setTableComment('');
      setSelectedTableExpense(null);
      fetchMyExpenses();
    } catch (error) {
      console.error(`Error ${action} expense:`, error);
    }
  };

  const handleForwardExpense = async (expenseId) => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/expenses/${expenseId}/forward`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comment: tableComment })
      // });
      // if (response.ok) {
      //   fetchMyExpenses();
      //   setTableComment('');
      //   setSelectedTableExpense(null);
      // }
      
      console.log(`Forwarding expense ${expenseId} to higher authority with comment: ${tableComment}`);
      setTableComment('');
      setSelectedTableExpense(null);
      fetchMyExpenses();
    } catch (error) {
      console.error('Error forwarding expense:', error);
    }
  };

  const filteredExpenses = expenses.filter(exp => {
    if (activeTab !== 'all' && exp.status !== activeTab) return false;
    if (filterCategory !== 'all' && exp.category !== filterCategory) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Approvals</h1>
          <p className="text-gray-600">Review and manage pending expense requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {expenses.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {expenses.filter(e => e.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {expenses.filter(e => e.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currency}{expenses.reduce((sum, e) => sum + (e.convertedAmount || 0), 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b">
            <div className="flex space-x-1 mb-4 md:mb-0">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'rejected'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
            </div>

            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="employee">Sort by Employee</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expense List */}
          <div className="divide-y">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading expenses...</p>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No expenses found</p>
                <p className="text-gray-400 text-sm mt-2">There are no {activeTab !== 'all' ? activeTab : ''} expenses to display</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-lg text-gray-900">{expense.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(expense.status)}`}>
                          {getStatusIcon(expense.status)}
                          <span className="capitalize">{expense.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span className="font-medium">{expense.employee}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{expense.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span className="font-semibold">{expense.currency} {expense.amount.toFixed(2)}</span>
                          {expense.convertedAmount !== expense.amount && (
                            <span className="ml-2 text-gray-400">(USD {expense.convertedAmount.toFixed(2)})</span>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Filter className="w-4 h-4 mr-2" />
                          <span>{expense.category}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{expense.description}</p>
                      
                      {/* Approval Progress */}
                      {expense.status === 'pending' && (
                        <div className="mb-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                            <span>Step {expense.currentStep} of {expense.totalSteps}</span>
                            <span className="text-gray-400">•</span>
                            <span>Current: {expense.currentApprover}</span>
                            {expense.nextApprover && (
                              <>
                                <span className="text-gray-400">→</span>
                                <span>Next: {expense.nextApprover}</span>
                              </>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(expense.currentStep / expense.totalSteps) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {expense.status === 'rejected' && expense.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-800">
                            <span className="font-semibold">Rejection Reason:</span> {expense.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {expense.status === 'pending' && (
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => setSelectedExpense(expense)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          Review
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Expenses / Approved Expenses Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userRole === 'employee' ? 'My Expenses' : 'My Approved Expenses'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {userRole === 'employee' 
                    ? 'Track your submitted expense requests' 
                    : 'Expenses you have approved - forward to higher authorities'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingMyExpenses ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading expenses...</p>
              </div>
            ) : myExpenses.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No expenses found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {userRole === 'employee' 
                    ? 'You haven\'t submitted any expenses yet' 
                    : 'No approved expenses to forward'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expense ID
                    </th>
                    {userRole === 'manager' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {userRole === 'employee' ? 'Progress' : 'Next Step'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{expense.id}</span>
                      </td>
                      {userRole === 'manager' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{expense.employee}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </div>
                        {expense.convertedAmount !== expense.amount && (
                          <div className="text-xs text-gray-400">
                            USD {expense.convertedAmount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{expense.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {expense.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(expense.status)}`}>
                          {getStatusIcon(expense.status)}
                          <span className="capitalize">{expense.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {userRole === 'employee' ? (
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium mb-1">
                              Step {expense.currentStep} of {expense.totalSteps}
                            </div>
                            <div className="text-xs text-gray-500">
                              {expense.currentApprover}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm">
                            {expense.nextApprover ? (
                              <div className="flex items-center text-gray-900">
                                <ArrowRight className="w-4 h-4 mr-1" />
                                {expense.nextApprover}
                              </div>
                            ) : (
                              <span className="text-gray-400">Final Step</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userRole === 'employee' ? (
                          <button
                            onClick={() => setSelectedTableExpense(expense)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedTableExpense(expense)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Forward
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Table Action Modal */}
      {selectedTableExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {userRole === 'employee' ? 'Expense Details' : 'Forward Expense'}
              </h2>
              <p className="text-gray-600 mt-1">{selectedTableExpense.id}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {userRole === 'manager' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Employee</p>
                    <p className="font-medium text-gray-900">{selectedTableExpense.employee}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="font-medium text-gray-900">
                    {selectedTableExpense.currency} {selectedTableExpense.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-medium text-gray-900">{selectedTableExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{selectedTableExpense.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 ${getStatusColor(selectedTableExpense.status)}`}>
                    {getStatusIcon(selectedTableExpense.status)}
                    <span className="capitalize">{selectedTableExpense.status}</span>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{selectedTableExpense.description}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Approval Progress</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Step {selectedTableExpense.currentStep} of {selectedTableExpense.totalSteps}
                    </span>
                    <span className="text-xs text-gray-600">
                      Current: {selectedTableExpense.currentApprover}
                    </span>
                  </div>
                  {selectedTableExpense.nextApprover && (
                    <div className="text-xs text-gray-600 flex items-center mt-2">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Next: {selectedTableExpense.nextApprover}
                    </div>
                  )}
                </div>
              </div>

              {userRole === 'manager' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Comment (Optional)
                  </label>
                  <textarea
                    value={tableComment}
                    onChange={(e) => setTableComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Add any notes before forwarding to higher authority..."
                  ></textarea>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedTableExpense(null);
                    setTableComment('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                {userRole === 'manager' && (
                  <button
                    onClick={() => handleForwardExpense(selectedTableExpense.id)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Forward to {selectedTableExpense.nextApprover || 'Higher Authority'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Review Expense</h2>
              <p className="text-gray-600 mt-1">{selectedExpense.id}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Employee</p>
                  <p className="font-medium text-gray-900">{selectedExpense.employee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="font-medium text-gray-900">{selectedExpense.currency} {selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-medium text-gray-900">{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{selectedExpense.date}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{selectedExpense.description}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Approval Flow</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">Step {selectedExpense.currentStep} of {selectedExpense.totalSteps}</span>
                    <span className="text-gray-400">•</span>
                    <span>Current: {selectedExpense.currentApprover}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Comment {selectedExpense.status === 'pending' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter your comment or reason for approval/rejection..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedExpense(null);
                    setComment('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedExpense.id)}
                  disabled={!comment.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedExpense.id)}
                  disabled={!comment.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseApprovalDashboard;