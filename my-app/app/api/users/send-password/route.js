// API route to send a random password to a user's email and reset their password
import dbConnect from '@/app/api/models/dbConnect';
import User from '@/app/api/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  await dbConnect();
  try {
    const { username, email } = await req.json();
    if (!username || !email) {
      return Response.json({ error: 'Username and email are required.' }, { status: 400 });
    }
    // Find user
    const user = await User.findOne({ username, email });
    if (!user) {
      return Response.json({ error: 'User not found.' }, { status: 404 });
    }
    // Generate random password
    const password = Math.random().toString(36).slice(-10);
    // Update user's password (assume plain text for now, hash in production)
    user.password = password;
    await user.save();
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your New Account Password',
      text: `Hello ${username},\n\nYour new password is: ${password}\n\nPlease log in and change your password after logging in.`,
    });
    return Response.json({ message: 'Password sent successfully.' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
