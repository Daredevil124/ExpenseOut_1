import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Expense from '@/models/Expense';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { id } = params; // This is the expense ID

    const expense = await Expense.findById(id).lean(); // .lean() for a plain JS object

    if (!expense) {
      return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
    }

    const historyMap = {
      approved: expense.approved || new Map(),
      pending: expense.pending || new Map(),
      rejected: expense.rejected || new Map(),
    };

    const userIds = new Set();
    Object.values(historyMap).forEach(statusMap => {
        for (const userId of statusMap.keys()) {
            userIds.add(userId);
        }
    });

    if (userIds.size === 0) {
        return NextResponse.json([]); // No history to show
    }

    // Find all users in a single query for efficiency
    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('username role');
    const userLookup = new Map(users.map(user => [user._id.toString(), { name: user.username, role: user.role }]));

    const approvalHistory = [];

    // Combine user data with comments
    for (const [status, statusMap] of Object.entries(historyMap)) {
        for (const [userId, data] of statusMap.entries()) {
            const userDetails = userLookup.get(userId) || { name: 'Unknown User', role: 'Unknown' };
            approvalHistory.push({
                name: userDetails.name,
                role: userDetails.role,
                comment: data.comment,
                status: status,
                timestamp: data.timestamp
            });
        }
    }
    
    // Sort by timestamp if available
    approvalHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json(approvalHistory);
  } catch (error) {
    console.error('Error fetching approval history:', error);
    return NextResponse.json({ message: 'Server error while fetching history' }, { status: 500 });
  }
}
