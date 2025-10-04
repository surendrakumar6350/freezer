
// Next.js API route for generating S3 signed URLs
import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimiter";


// Rate limit config
const RATE_LIMIT = 20;
const WINDOW_SEC = 5;


// Initialize AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


// GET handler for generating S3 signed URLs
export async function GET(request: NextRequest) {
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

  // Rate limiting per IP
  const rateLimitKey = `rate_limit:s3url:${ip}`;
  const allowed = await rateLimit(rateLimitKey, RATE_LIMIT, WINDOW_SEC);
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    // Generate signed URL for S3 object
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
}
