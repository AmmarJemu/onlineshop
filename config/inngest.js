import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/modals/User";

// inngest functions
const syncUserCreation = new Inngest().createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDB();
    await User.create(userData);
  }
);

const syncUpdation = new Inngest().createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      name: first_name + " " + last_name,
      email: email_addresses[0]?.email_address,
      imageUrl: image_url,
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

const syncUserDeletion = new Inngest().createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// ✅ Register all functions in the client
export const inngest = new Inngest({
  id: "Muhamiz-next",
  functions: [syncUserCreation, syncUpdation, syncUserDeletion],
});

// Export functions (optional if used elsewhere)
export { syncUserCreation, syncUpdation, syncUserDeletion };
