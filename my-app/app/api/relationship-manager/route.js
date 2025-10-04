export async function DELETE(req) {
	await dbConnect();
	try {
		const body = await req.json();
		const { username } = body;
		if (!username) {
			return NextResponse.json({ error: 'Username is required for deletion.' }, { status: 400 });
		}
		const deleted = await RelationshipManager.deleteOne({ username });
		if (deleted.deletedCount === 0) {
			return NextResponse.json({ error: 'No relationship found to delete.' }, { status: 404 });
		}
		return NextResponse.json({ message: 'Relationship deleted successfully.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
// Assumptions:
// - There is a working MongoDB connection utility (e.g., dbConnect) available.
// - User model is imported from '../../models/User'.
// - RelationshipManager model is imported from '../../models/RelationshipManager'.
// - All models use Mongoose and are correctly defined.
// - This file is a Next.js route handler (app router, not pages/api).
// - Only the PUT method is implemented here.

import dbConnect from '@/app/api/models/dbConnect';
import User from '@/app/api/models/User';
import RelationshipManager from '@/app/api/models/RelationshipManager';
import { NextResponse } from 'next/server';

export async function GET() {
	await dbConnect();
	try {
		const relationships = await RelationshipManager.find({}, 'username role manager email');
		return NextResponse.json({ relationships }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function PATCH(req) {
	await dbConnect();
	try {
		const body = await req.json();
		const { username, role, manager, email } = body;

		// Normalize role for comparison
		const normalizedRole = typeof role === 'string' ? role.toLowerCase() : '';

		// Type checks
		if (
			typeof username !== 'string' ||
			typeof role !== 'string' ||
			typeof email !== 'string' ||
			(normalizedRole !== 'admin' && typeof manager !== 'string')
		) {
			return NextResponse.json({ error: 'Invalid data types for one or more fields.' }, { status: 400 });
		}

		// Validation
		if (!username || !role || !email || (normalizedRole !== 'admin' && !manager)) {
			return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
		}

		// Check if relationship exists
		const relDoc = await RelationshipManager.findOne({ username });
		if (!relDoc) {
			return NextResponse.json({ error: 'No relationship found for this user. Please use the PUT API to create a new relationship.' }, { status: 404 });
		}

		// If not admin, find or create manager
		let managerUser = null;
		if (normalizedRole !== 'admin') {
			managerUser = await User.findOne({ username: manager });
			if (!managerUser) {
				managerUser = await User.create({ username: manager, role: 'manager', email: manager + '@example.com' });
			}
		}

		// Update the relationship
		relDoc.role = role;
		relDoc.email = email;
		relDoc.manager = normalizedRole === 'admin' ? null : managerUser.username;
		await relDoc.save();

		return NextResponse.json({ message: 'Relationship updated successfully.', username: relDoc.username }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}

export async function PUT(req) {
	await dbConnect();
	try {
		const body = await req.json();
		const { username, role, manager, email } = body;

		// Normalize role for comparison
		const normalizedRole = typeof role === 'string' ? role.toLowerCase() : '';

		// Type checks
		if (
			typeof username !== 'string' ||
			typeof role !== 'string' ||
			typeof email !== 'string' ||
			(normalizedRole !== 'admin' && typeof manager !== 'string')
		) {
			return NextResponse.json({ error: 'Invalid data types for one or more fields.' }, { status: 400 });
		}

		// Validation
		if (!username || !role || !email || (normalizedRole !== 'admin' && !manager)) {
			return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
		}

		// Find or create user
		let user = await User.findOne({ username });
		if (!user) {
			user = await User.create({ username, email, role });
		}

		// If not admin, find or create manager
		let managerUser = null;
		if (normalizedRole !== 'admin') {
			managerUser = await User.findOne({ username: manager });
			if (!managerUser) {
				managerUser = await User.create({ username: manager, role: 'manager', email: manager + '@example.com' });
			}
		}

		// Check if relationship already exists
		const exists = await RelationshipManager.findOne({ username });
		if (exists) {
			return NextResponse.json(
				{ error: 'A relationship for this user already exists. Please use the PATCH API to update the relationship instead of creating a new one.' },
				{ status: 409 }
			);
		}

		// Create new relationship
		const relDoc = await RelationshipManager.create({
			username,
			role,
			manager: normalizedRole === 'admin' ? null : managerUser.username,
			email,
		});

		return NextResponse.json({ message: 'Relationship created successfully.', username: relDoc.username }, { status: 201 });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
