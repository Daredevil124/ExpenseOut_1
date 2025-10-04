// Assumptions:
// - User model is available at '../../models/User'
// - dbConnect is available at '../../models/dbConnect'
// - This is a Next.js app router route

import User from '@/app/api/models/User';
import dbConnect from '@/app/api/models/dbConnect';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}, 'username role email');
    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
