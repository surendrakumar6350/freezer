
// Next.js API route for listing S3 bucket contents
import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimiter";
import jwt from "jsonwebtoken";

// Initialize AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Rate limit config
const RATE_LIMIT = 20;
const WINDOW_SEC = 5;

// JWT secret helper
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

// Force dynamic rendering to avoid caching
export const dynamic = "force-dynamic";

// GET handler for listing S3 bucket files
export async function GET(request: NextRequest) {
  try {
    // Validate auth token from cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing authentication token." },
        { status: 401 }
      );
    }
    try {
      jwt.verify(token, getJwtSecret());
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // Get client IP address
    const headersList = await headers();
    const ip =
      headersList.get("cf-connecting-ip") ||
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (ip === "unknown") {
      // IP address not found
      return NextResponse.json(
        { success: false, message: "Unable to determine IP address." },
        { status: 400 }
      );
    }

    // Rate limiting per IP
    const rateLimitKey = `rate_limit:s3:${ip}`;
    const allowed = await rateLimit(rateLimitKey, RATE_LIMIT, WINDOW_SEC);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(WINDOW_SEC) } }
      );
    }

    // Get bucket name from environment
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) {
      // Bucket not configured
      return NextResponse.json(
        { success: false, message: "Bucket not configured" },
        { status: 500 }
      );
    }

    // List objects in S3 bucket
    const data = await s3.listObjectsV2({ Bucket: bucket }).promise();
    const files = (data.Contents || []).map((obj) => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
    }));
    return NextResponse.json({ success: true, files });
  } catch (error) {
    // Log error and return server error
    console.error("S3 List Error:", error);
    return NextResponse.json(
      { success: false, message: "Error listing S3 bucket" },
      { status: 500 }
    );
  }
}
