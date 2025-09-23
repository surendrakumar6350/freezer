import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET() {
  try {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) {
      return NextResponse.json({ success: false, message: "Bucket not configured" }, { status: 500 });
    }
    const data = await s3.listObjectsV2({ Bucket: bucket }).promise();
    const files = (data.Contents || []).map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
    }));
    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("S3 List Error:", error);
    return NextResponse.json({ success: false, message: "Error listing S3 bucket" }, { status: 500 });
  }
}
