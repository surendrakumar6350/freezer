
// Next.js API route for user login
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimiter";


// Environment variables and rate limit config
const JWT_SECRET = process.env.JWT_SECRET;
const RATE_LIMIT = 20; // Max requests per window
const WINDOW_SEC = 5; // Window size in seconds

// Helper to get JWT secret
function getJwtSecret(): string {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return JWT_SECRET;
}


// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// POST handler for login
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Parse request body
        const body = await request.json();
        const { username, password } = body;

        // Get credentials from environment
        const envUsername = process.env.USER_USERNAME;
        const envPassword = process.env.USER_PASSWORD;

        if (!envUsername || !envPassword) {
            // Server misconfiguration
            return NextResponse.json(
                { success: false, message: "Server misconfiguration: missing credentials" },
                { status: 500 }
            );
        }

        // Get client IP address
        const headersList = await headers();
        const ip =
            headersList.get("cf-connecting-ip") || // Used if behind Cloudflare
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || // Fallback
            "unknown";

        if (ip === "unknown") {
            // IP address not found
            return NextResponse.json(
                { success: false, message: "Unable to determine IP address." },
                { status: 400 }
            );
        }

        // Rate limiting per IP
        const rateLimitKey = `rate_limit:${ip}`;
        const allowed = await rateLimit(rateLimitKey, RATE_LIMIT, WINDOW_SEC);
        if (!allowed) {
            return NextResponse.json(
                { success: false, message: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // Check credentials
        if (username === envUsername && password === envPassword) {
            // Generate JWT token
            const expiresInSeconds = 60 * 60 * 5;
            const token = jwt.sign({ username }, getJwtSecret(), { expiresIn: expiresInSeconds });

            // Set token as httpOnly cookie
            const response = NextResponse.json({
                success: true,
                message: "Logged in successfully",
                token,
            });

            response.cookies.set("token", token, {
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: expiresInSeconds,
            });

            return response;
        }

        // Invalid credentials
        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        // Log error and return server error
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}