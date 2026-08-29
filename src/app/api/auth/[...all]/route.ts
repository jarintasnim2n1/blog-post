import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export const GET = async (req: NextRequest) => {
  try {
    console.log("[AUTH GET]", req.url);
    return await handler.GET(req);
  } catch (error) {
    console.error("[AUTH GET ERROR]", error);
    throw error;
  }
};

export const POST = async (req: NextRequest) => {
  try {
    console.log("[AUTH POST]", req.url);
    return await handler.POST(req);
  } catch (error) {
    console.error("[AUTH POST ERROR]", error);
    throw error;
  }
};