'use client';
import React, { useState, useEffect } from 'react';

// --- Helper Icon Components ---

const FileUploadIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

const SubmitIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);


// --- Main Page Component ---
export default function CreateExpensePage() {
    // --- State Management ---
    const [description, setDescription] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [paidBy, setPaidBy] = useState('employee');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [currencies, setCurrencies] = useState([]);

    // Mock data for categories and approval status
    const categories = ['Food', 'Travel', 'Software', 'Office Supplies', 'Other'];
    const approvalStatus = [
        { approver: 'Sarah (Manager)', status: 'Approved', time: '12:44 4th Oct, 2025' },
        { approver: 'Finance Dept', status: 'Pending', time: 'Waiting...' },
    ];

    // Fetch currencies when the component mounts
    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const res = await fetch('https://restcountries.com/v3.1/all?fields=currencies');
                if (!res.ok) throw new Error('Failed to fetch currencies');
                const data = await res.json();
                const currencySet = new Set();
                data.forEach(country => {
                    if (country.currencies) {
                        Object.keys(country.currencies).forEach(code => currencySet.add(code));
                    }
                });
                setCurrencies(Array.from(currencySet).sort());
            } catch (error) {
                console.error("Could not fetch currencies:", error);
                // Fallback to a default list if the API fails
                setCurrencies(['USD', 'EUR', 'GBP', 'INR', 'JPY']);
            }
        };
        fetchCurrencies();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseData = {
            description,
            expenseDate,
            category,
            paidBy,
            amount,
            currency,
            detailedDescription,
        };
        console.log("Submitting Expense:", expenseData);
        // Here you would typically send the data to your backend API
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    {/* Header Section */}
                    <header className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            {/* Breadcrumbs / Status */}
                            <div className="text-lg font-semibold text-gray-400 mb-4 sm:mb-0">
                                <span className="text-white">Draft</span>
                                <span className="mx-2">&gt;</span>
                                <span>Waiting approval</span>
                            </div>
                            {/* Action Button */}
                            <div>
                                <button type="button" className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 shadow">
                                    <FileUploadIcon />
                                    Attach Receipt
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Form Section */}
                    <main className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <input
                                    type="text"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., Client Dinner"
                                    required
                                />
                            </div>

                            {/* Expense Date */}
                            <div>
                                <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-400 mb-1">Expense Date</label>
                                <input
                                    type="date"
                                    id="expenseDate"
                                    value={expenseDate}
                                    onChange={(e) => setExpenseDate(e.target.value)}
                                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Paid By */}
                            <div>
                                <label htmlFor="paidBy" className="block text-sm font-medium text-gray-400 mb-1">Paid By</label>
                                <select
                                    id="paidBy"
                                    value={paidBy}
                                    onChange={(e) => setPaidBy(e.target.value)}
                                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="employee">Employee (me)</option>
                                    <option value="company">Company Card</option>
                                </select>
                            </div>

                            {/* Amount & Currency */}
                            <div className="md:col-span-2">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Total Amount</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-gray-700 border-gray-600 text-white rounded-l-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0.00"
                                        step="0.01"
                                        required
                                    />
                                    <select
                                        id="currency"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="bg-gray-600 border-gray-600 text-white rounded-r-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {currencies.map((curr) => (
                                            <option key={curr} value={curr}>{curr}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Detailed Description */}
                            <div className="md:col-span-2">
                                <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-400 mb-1">Detailed Description</label>
                                <textarea
                                    id="detailedDescription"
                                    value={detailedDescription}
                                    onChange={(e) => setDetailedDescription(e.target.value)}
                                    rows="4"
                                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Add any extra details, like attendees or project codes..."
                                />
                            </div>
                        </div>
                    </main>

                    {/* Approval Status Section */}
                    <footer className="mt-8 bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Approval Status</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                    <tr>
                                        <th scope="col" className="p-3">Approver</th>
                                        <th scope="col" className="p-3">Status</th>
                                        <th scope="col" className="p-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvalStatus.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-700">
                                            <td className="p-3 font-medium text-white">{item.approver}</td>
                                            <td className="p-3">{item.status}</td>
                                            <td className="p-3">{item.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </footer>

                    {/* Submit Button */}
                    <div className="mt-8 text-right">
                        <button type="submit" className="flex items-center justify-center ml-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 shadow-lg">
                            <SubmitIcon />
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

