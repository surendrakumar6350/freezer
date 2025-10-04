import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimiter";

const JWT_SECRET = process.env.JWT_SECRET;
const RATE_LIMIT = 20; // 20 requests
const WINDOW_SEC = 5; // 5 seconds

function getJwtSecret(): string {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return JWT_SECRET;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { username, password } = body;

        const envUsername = process.env.USER_USERNAME;
        const envPassword = process.env.USER_PASSWORD;

        if (!envUsername || !envPassword) {
            return NextResponse.json(
                { success: false, message: "Server misconfiguration: missing credentials" },
                { status: 500 }
            );
        }

        const headersList = await headers();
        const ip =
            headersList.get("cf-connecting-ip") || // Used if behind Cloudflare
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || // Fallback
            "unknown";

        if (ip === "unknown") {
            return NextResponse.json(
                { success: false, message: "Unable to determine IP address." },
                { status: 400 }
            );
        }

        const rateLimitKey = `rate_limit:${ip}`;
        const allowed = await rateLimit(rateLimitKey, RATE_LIMIT, WINDOW_SEC);

        if (!allowed) {
            return NextResponse.json(
                { success: false, message: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }


        if (username === envUsername && password === envPassword) {
            const expiresInSeconds = 60 * 60 * 5;
            const token = jwt.sign({ username }, getJwtSecret(), { expiresIn: expiresInSeconds });

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

        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}