import { serve } from 'inngest/next';
import { inngest, syncUserCreation, syncUpdation, syncUserDeletion } from '@/config/inngest';

// Create the handler
const handler = serve({
  client: inngest,
  functions: [syncUserCreation, syncUpdation, syncUserDeletion],
  
});


export const { GET, POST, PUT } = handler;

