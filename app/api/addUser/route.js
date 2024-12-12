import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/configs/db';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure the database connection is established
    await dbConnect();

    // Extract the Clerk authentication token
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch the user details from Clerk
    const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_API_KEY}`, // Replace with your Clerk API key
      },
    });

    const clerkUser = await clerkResponse.json();

    if (!clerkResponse.ok) {
      return res.status(clerkResponse.status).json({ error: clerkUser.error || 'Error fetching Clerk user' });
    }

    // Extract relevant details
    const { first_name, last_name, email_addresses } = clerkUser;
    const name = `${first_name} ${last_name}`;
    const email = email_addresses?.[0]?.email_address || '';

    // Check if the user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ success: true, message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
