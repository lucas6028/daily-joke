import crypto from "crypto";
import { cookies } from "next/headers";

// Generate a CSRF token
export function generateCSRFToken() {
  const token = crypto.randomBytes(32).toString("hex");
  cookies().set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return token;
}

// Verify a CSRF token
export function verifyCSRFToken(token: string) {
  const cookieToken = cookies().get("csrf-token")?.value;
  return token === cookieToken;
}
