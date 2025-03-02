import { createCookie } from "react-router";

// Common cookie options
const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.COOKIE_SECRET || "dev-secret-key"],
};

// Authentication cookies
export const authTokenCookie = createCookie("auth-token", {
  ...cookieOptions,
  maxAge: 604_800, // one week
  httpOnly: true, // More secure as JS can't access it
});

export const userDataCookie = createCookie("user-data", {
  ...cookieOptions,
  maxAge: 604_800, // one week
  httpOnly: true,
});

export const authExpirationCookie = createCookie("auth-expires", {
  ...cookieOptions,
  maxAge: 604_800, // one week
  httpOnly: true,
});

// Theme preference cookie (client accessible)
export const themeCookie = createCookie("theme-pref", {
  ...cookieOptions,
  maxAge: 31_536_000, // one year
  httpOnly: false, // Allow JavaScript access
});