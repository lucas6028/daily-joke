import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, apiRateLimit, loginRateLimit } from "@/lib/rate-limit";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Get identifier for rate limiting
  const ip =
    request.ip ?? request.headers.get("x-forwarded-for") ?? "anonymous";

  // Choose rate limiter based on route
  let limiter = apiRateLimit;
  let identifier = ip;

  // Apply different rate limits based on route
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    limiter = loginRateLimit;
    identifier = `login_${ip}`;
  } else if (request.nextUrl.pathname.startsWith("/api/rating")) {
    // Use specific identifier for rating routes
    identifier = `rating_${ip}`;
  } else if (request.nextUrl.pathname.startsWith("/api/joke")) {
    // Use specific identifier for rating routes
    identifier = `joke_${ip}`;
  }

  // Check rate limit
  const rateLimitResult = await checkRateLimit(identifier, limiter);

  // If rate limited, return 429 response
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          "Retry-After": Math.ceil(
            (rateLimitResult.reset - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: ["/api/:path*"],
};
