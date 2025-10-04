'use-client';
import React from 'react';
import { useState, useEffect } from 'react';

// --- Helper Components & Data ---

// Icon for the "New Expense" button
const PlusIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
);

// Icon for the "Upload Receipt" button
const UploadIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


// Arrow icon for the status tracker
const ArrowRightIcon = () => (
  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
  </svg>
);

// Component for colored status badges
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium tracking-wider rounded-full";
  const statusStyles = {
    'Draft': 'bg-gray-200 text-gray-800',
    'Submitted': 'bg-yellow-200 text-yellow-800',
    'Approved': 'bg-green-200 text-green-800',
    'Rejected': 'bg-red-200 text-red-800',
    'Waiting Approval': 'bg-blue-200 text-blue-800'
  };
  return <span className={`${baseClasses} ${statusStyles[status] || statusStyles['Draft']}`}>{status}</span>;
};
async function fetchExpenses(companyId, userId) {
  const res = await fetch(`/api/expenses?companyId=${companyId}&userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return await res.json();
}
// Mock data for expenses
// const expensesData = [
//   { id: 1, employee: 'Sarah Jacobs', description: 'Restaurant bill with client', date: '4th Oct, 2025', category: 'Food & Dining', paidBy: 'Sarah Jacobs', remarks: 'Client entertainment', amount: 5000, status: 'Submitted' },
//   { id: 2, employee: 'Shah Rohan', description: 'Taxi from airport', date: '3rd Oct, 2025', category: 'Travel', paidBy: 'Shah Rohan', remarks: 'Business trip to Delhi', amount: 1250, status: 'Approved' },
//   { id: 3, employee: 'Ancient Cassowary', description: 'Software Subscription (Figma)', date: '1st Oct, 2025', category: 'Software', paidBy: 'Ancient Cassowary', remarks: 'Monthly design tool', amount: 2400, status: 'Draft' },
//   { id: 4, employee: 'Sarah Jacobs', description: 'Hotel Stay - Mumbai', date: '29th Sep, 2025', category: 'Accommodation', paidBy: 'Corporate Card', remarks: 'Q3 Sales Meeting', amount: 15500, status: 'Waiting Approval' },
//   { id: 5, employee: 'Shah Rohan', description: 'Office Supplies', date: '28th Sep, 2025', category: 'Office Supplies', paidBy: 'Shah Rohan', remarks: 'Printer paper and ink', amount: 3200, status: 'Rejected' },
//   { id: 6, employee: 'Sarah Jacobs', description: 'Team Lunch', date: '25th Sep, 2025', category: 'Food & Dining', paidBy: 'Sarah Jacobs', remarks: 'Celebrating project completion', amount: 8750, status: 'Approved' },
// ];
export default function App() {
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await fetchExpenses('YOUR_COMPANY_ID', 'YOUR_USER_ID');
        setExpensesData(data);
      } catch (err) {
        console.log("Expense error!");
      }
    }
    loadExpenses();
  }, []);
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">My Expenses</h1>
            <div className="flex items-center space-x-3">
              <button className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow">
                <UploadIcon />
                Upload Receipt
              </button>
              <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg">
                <PlusIcon />
                New Expense
              </button>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-400">To Submit</p>
              <p className="text-2xl font-bold text-white">₹5,467</p>
            </div>
            <div className="hidden md:flex justify-center">
              <ArrowRightIcon />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-400">Waiting Approval</p>
              <p className="text-2xl font-bold text-yellow-400">₹33,674</p>
            </div>
             <div className="hidden md:flex justify-center">
              <ArrowRightIcon />
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-400">₹500</p>
            </div>
          </div>
        </header>

        {/* Expenses Table */}
        <main>
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th scope="col" className="p-4">Employee</th>
                    <th scope="col" className="p-4">Description</th>
                    <th scope="col" className="p-4">Date</th>
                    <th scope="col" className="p-4">Category</th>
                    <th scope="col" className="p-4">Paid By</th>
                    <th scope="col" className="p-4">Amount</th>
                    <th scope="col" className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expensesData.map((expense) => (
                    <tr key={expense.categoryid} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="p-4 font-medium text-white">{expense.username}</td>
                      <td className="p-4">{expense.description}</td>
                      <td className="p-4">{expense.expens_date}</td>
                      <td className="p-4">{expense.category}</td>
                      <td className="p-4">{expense.paidBy}</td>
                      <td className="p-4 font-mono text-white">{expense.currency}{expense.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center">
                        <StatusBadge status={expense.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
