import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db'; // Assuming you have a db connection utility
import Expense from '@/models/Expense'; // Assuming models are in a /models directory
import User from '@/models/User'; // We need the User model for populating

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const userId = searchParams.get('userId');

    if (!companyId || !userId) {
      return NextResponse.json({ message: 'Company ID and User ID are required' }, { status: 400 });
    }

    const expenses = await Expense.find({
      company_id: companyId,
      user_id: userId
    }).sort({ expense_date: -1 });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ message: 'Server error while fetching expenses' }, { status: 500 });
  }
}
