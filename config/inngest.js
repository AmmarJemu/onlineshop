import { Inngest } from 'inngest';
import connectDB from './db'; // Ensure this properly initializes MongoDB connection
import User from '@/modals/User';

// Initialize Inngest with your app name
export const inngest = new Inngest({ 
  id: 'your-app-name',
  // Add signing key if using Inngest Cloud
  // eventKey: process.env.INNGEST_EVENT_KEY
});

// Helper function to ensure DB connection
async function withDB(callback) {
  await connectDB();
  return callback();
}

// Define your functions
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk', name: 'Sync User Creation from Clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    return withDB(async () => {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      };
      await User.create(userData);
    });
  }
);

export const syncUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk', name: 'Sync User Updates from Clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    return withDB(async () => {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        name: `${first_name} ${last_name}`,
        email: email_addresses[0]?.email_address,
        imageUrl: image_url,
      };
      await User.findByIdAndUpdate(id, userData);
    });
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk', name: 'Sync User Deletion from Clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    return withDB(async () => {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
    });
  }
);