import { inngest, syncUserCreation, syncUpdation, syncUserDeletion } from "@/config/inngest";
import { serve } from "inngest";

// Create the handler using the latest Inngest serve API
export const { POST, GET, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUpdation, syncUserDeletion],

  
});