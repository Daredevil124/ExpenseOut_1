'use client';
import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Components ---

const PlusIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
);

const UploadIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
  </svg>
);

const StatusBadge = ({ status }) => {
  const baseClasses = "capitalize px-3 py-1 text-xs font-medium tracking-wider rounded-full";
  const statusStyles = {
    pending: 'bg-yellow-200 text-yellow-800',
    approved: 'bg-green-200 text-green-800',
    rejected: 'bg-red-200 text-red-800',
  };
  return <span className={`${baseClasses} ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>{status}</span>;
};

// --- Modal Component ---
const ApprovalHistoryModal = ({ history, expenseDescription, onClose, isLoading }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Approval History: <span className="text-indigo-400">{expenseDescription}</span></h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center text-gray-300">Loading history...</div>
                  ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="p-3">Name</th>
                                    <th scope="col" className="p-3">Role</th>
                                    <th scope="col" className="p-3">Comment</th>
                                    <th scope="col" className="p-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? history.map((approval, index) => (
                                    <tr key={index} className="border-b border-gray-700">
                                        <td className="p-3 font-medium text-white">{approval.name}</td>
                                        <td className="p-3 capitalize">{approval.role}</td>
                                        <td className="p-3 italic">"{approval.comment || 'No comment'}"</td>
                                        <td className="p-3 text-center">
                                            <StatusBadge status={approval.status} />
                                        </td>
                                    </tr>
                                )) : (
                                  <tr>
                                    <td colSpan="4" className="text-center p-4">No approval history found.</td>
                                  </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                  )}
                </div>
                 <div className="p-4 bg-gray-700/50 rounded-b-lg text-right">
                    <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
export default function EmployeeExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sums, setSums] = useState({ approved: 0, pending: 0, toSubmit: 0 });
  const [currency, setCurrency] = useState('₹');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsLoading, setModalIsLoading] = useState(false);
  const [selectedExpenseHistory, setSelectedExpenseHistory] = useState([]);
  const [selectedExpenseDescription, setSelectedExpenseDescription] = useState('');

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      // Replace with your actual company and user IDs from authentication
      const companyId = 'YOUR_COMPANY_ID'; 
      const userId = 'YOUR_USER_ID';
      
      const res = await fetch(`/api/expenses?companyId=${companyId}&userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const curr = localStorage.getItem('currency') || '₹';
    setCurrency(curr);
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    const totals = expenses.reduce((acc, expense) => {
        const amount = parseFloat(expense.amount?.$numberDecimal || 0);
        if (expense.status === 'approved') acc.approved += amount;
        if (expense.status === 'pending') acc.pending += amount;
        // Add a 'draft' or 'to submit' status in your schema for this
        // if (expense.status === 'draft') acc.toSubmit += amount;
        return acc;
    }, { approved: 0, pending: 0, toSubmit: 0 });
    setSums(totals);
  }, [expenses]);

  const handleOpenModal = async (expense) => {
    setSelectedExpenseDescription(expense.description);
    setIsModalOpen(true);
    setModalIsLoading(true);
    try {
        const res = await fetch(`/api/expenses/${expense._id}/history`);
        if (!res.ok) throw new Error('Failed to fetch history');
        const historyData = await res.json();
        setSelectedExpenseHistory(historyData);
    } catch (error) {
        console.error("Failed to load approval history:", error);
        setSelectedExpenseHistory([]); // Clear history on error
    } finally {
        setModalIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpenseHistory([]);
    setSelectedExpenseDescription('');
  };

  const hasHistory = (expense) => {
    const hasApproved = expense.approved && Object.keys(expense.approved).length > 0;
    const hasPending = expense.pending && Object.keys(expense.pending).length > 0;
    const hasRejected = expense.rejected && Object.keys(expense.rejected).length > 0;
    return hasApproved || hasPending || hasRejected;
  }

  return (
    <>
      <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">My Expenses</h1>
              <div className="flex items-center space-x-3">
                <button className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow"><UploadIcon />Upload Receipt</button>
                <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg"><PlusIcon />New Expense</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-400">To Submit</p>
                <p className="text-2xl font-bold text-white">{currency}{sums.toSubmit.toLocaleString('en-IN')}</p>
              </div>
              <div className="hidden md:flex justify-center"><ArrowRightIcon /></div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-400">Waiting Approval</p>
                <p className="text-2xl font-bold text-yellow-400">{currency}{sums.pending.toLocaleString('en-IN')}</p>
              </div>
              <div className="hidden md:flex justify-center"><ArrowRightIcon /></div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-400">{currency}{sums.approved.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </header>

          <main>
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="text-center p-8">Loading expenses...</div>
                ) : (
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                      <tr>
                        <th scope="col" className="p-4">Employee</th>
                        <th scope="col" className="p-4">Description</th>
                        <th scope="col" className="p-4">Date</th>
                        <th scope="col" className="p-4">Amount</th>
                        <th scope="col" className="p-4 text-center">Status</th>
                        <th scope="col" className="p-4 text-center">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense) => (
                        <tr key={expense._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                          <td className="p-4 font-medium text-white">{expense.username}</td>
                          <td className="p-4">{expense.description}</td>
                          <td className="p-4">{new Date(expense.expense_date).toLocaleDateString()}</td>
                          <td className="p-4 font-mono text-white">{currency}{parseFloat(expense.amount.$numberDecimal).toLocaleString('en-IN')}</td>
                          <td className="p-4 text-center"><StatusBadge status={expense.status} /></td>
                          <td className="p-4 text-center">
                            <button 
                                onClick={() => handleOpenModal(expense)}
                                className="font-medium text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                disabled={!hasHistory(expense)}
                            >
                                View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {isModalOpen && <ApprovalHistoryModal history={selectedExpenseHistory} expenseDescription={selectedExpenseDescription} onClose={handleCloseModal} isLoading={modalIsLoading} />}
    </>
  );
}
