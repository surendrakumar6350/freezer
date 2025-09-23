import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket || !key) {
    return NextResponse.json({ success: false, message: "Missing bucket or key" }, { status: 400 });
  }
  try {
    const url = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 60 * 5, // 5 minutes
    });
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("S3 Signed URL Error:", error);
    return NextResponse.json({ success: false, message: "Error generating signed URL" }, { status: 500 });
  }
}
