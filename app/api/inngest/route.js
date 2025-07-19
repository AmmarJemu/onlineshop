import { inngest } from "@/config/inngest";

export const runtime = "edge";

export async function POST(req) {
  return inngest.handleRequest(req);
}
