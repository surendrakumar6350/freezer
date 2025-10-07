
// Next.js API route for generating S3 signed URLs
import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { headers } from "next/headers";
import { rateLimit, globalRateLimit } from "@/lib/rateLimiter";
import jwt from "jsonwebtoken";


// Rate limit config
const RATE_LIMIT = 20;
const WINDOW_SEC = 5;

// Global rate limit config (configurable via environment variables)
const GLOBAL_RATE_LIMIT = parseInt(process.env.S3_GLOBAL_RATE_LIMIT || "1000", 10);
const GLOBAL_WINDOW_SEC = parseInt(process.env.S3_GLOBAL_WINDOW_SEC || "60", 10);

// JWT secret helper (consistent with other routes)
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

// Force dynamic rendering to avoid caching
export const dynamic = "force-dynamic";


// Initialize AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


// GET handler for generating S3 signed URLs
export async function GET(request: NextRequest) {
  try {
    // Check for token cookie and validate JWT
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Missing authentication token." }, { status: 401 });
    }
    try {
      jwt.verify(token, getJwtSecret());
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired token." }, { status: 401 });
    }
    // Parse query params
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket || !key) {
      // Missing bucket or key
      return NextResponse.json({ success: false, message: "Missing bucket or key" }, { status: 400 });
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

    // Global rate limiting check (applies to all requests)
    const globalAllowed = await globalRateLimit("s3url", GLOBAL_RATE_LIMIT, GLOBAL_WINDOW_SEC);
    if (!globalAllowed) {
      console.error(`[S3URL] Global rate limit exceeded. IP: ${ip}`);
      return NextResponse.json(
        { success: false, message: "Service temporarily unavailable due to high demand. Please try again later." },
        { status: 503, headers: { "Retry-After": String(GLOBAL_WINDOW_SEC) } }
      );
    }

    // Rate limiting per IP
    const rateLimitKey = `rate_limit:s3url:${ip}`;
    const allowed = await rateLimit(rateLimitKey, RATE_LIMIT, WINDOW_SEC);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(WINDOW_SEC) } }
      );
    }

    // Generate signed URL for S3 object
    try {
      const url = s3.getSignedUrl("getObject", {
        Bucket: bucket,
        Key: key,
        Expires: 60 * 5, // 5 minutes
      });
      return NextResponse.json({ success: true, url });
    } catch (error) {
      // Log error and return server error
      console.error("S3 Signed URL Error:", error);
      return NextResponse.json({ success: false, message: "Error generating signed URL" }, { status: 500 });
    }
  } catch (error) {
    // Top-level error catch
    console.error("S3 Signed URL Route Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
