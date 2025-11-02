
// Next.js API route for listing S3 bucket contents
import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { headers } from "next/headers";
import { rateLimit, globalRateLimit } from "@/lib/rateLimiter";
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

// Global rate limit config (configurable via environment variables)
const GLOBAL_RATE_LIMIT = parseInt(process.env.S3_GLOBAL_RATE_LIMIT || "1000", 10);
const GLOBAL_WINDOW_SEC = parseInt(process.env.S3_GLOBAL_WINDOW_SEC || "60", 10);

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

    // Global rate limiting check (applies to all requests)
    const globalAllowed = await globalRateLimit("s3", GLOBAL_RATE_LIMIT, GLOBAL_WINDOW_SEC);
    if (!globalAllowed) {
      console.error(`[S3] Global rate limit exceeded. IP: ${ip}`);
      return NextResponse.json(
        { success: false, message: "Service temporarily unavailable due to high demand. Please try again later." },
        { status: 503, headers: { "Retry-After": String(GLOBAL_WINDOW_SEC) } }
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

    // Allowed prefixes to return. By default include both folders.
    // Can be overridden with comma-separated S3_ALLOWED_PREFIXES env var.
    const prefixes = (process.env.S3_ALLOWED_PREFIXES || 'apna-College-DSA/,hkirat-1-and-2/')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    // Fetch objects for each prefix in parallel and combine results.
    const listPromises = prefixes.map((prefix) =>
      s3.listObjectsV2({ Bucket: bucket, Prefix: prefix }).promise().then((res) => ({ prefix, contents: res.Contents || [] }))
    );

    const lists = await Promise.all(listPromises);

    // Flatten, filter empty/placeholder objects and dedupe by key
    const allObjects = lists
      .flatMap(({ prefix, contents }) =>
        contents.map((obj) => ({ prefix, obj }))
      )
      .filter(({ prefix, obj }) => {
        if (!obj.Key) return false;
        // Extra safety: ensure key starts with the expected prefix
        if (!obj.Key.startsWith(prefix)) return false;
        const key = obj.Key;
        // Remove zero-byte objects that are folder placeholders or empty names
        if (obj.Size === 0 && (key.endsWith('/') || key.split('/').pop()?.trim() === '')) return false;
        return true;
      })
      .map(({ obj }) => ({ key: obj.Key as string, size: obj.Size, lastModified: obj.LastModified }));

    // Deduplicate by key (in case of overlaps)
    const deduped: Record<string, { key: string; size?: number; lastModified?: Date }> = {};
    for (const o of allObjects) {
      deduped[o.key] = o;
    }

    const files = Object.values(deduped);

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
