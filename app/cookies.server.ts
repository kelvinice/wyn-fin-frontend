import { createCookie } from "react-router";

// Auth token cookie (short-lived)
export const authTokenCookie = createCookie('auth_token', {
  maxAge: 7200, // 2 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

// User data cookie
export const userDataCookie = createCookie('auth_user', {
  maxAge: 604800, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

// Auth expiration cookie
export const authExpirationCookie = createCookie('auth_expiration', {
  maxAge: 7200, // 2 hours
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

// Refresh token cookie (long-lived)
export const refreshTokenCookie = createCookie('refresh_token', {
  maxAge: 2592000, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

// Theme preference cookie (client accessible)
export const themeCookie = createCookie("theme-pref", {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.COOKIE_SECRET || "dev-secret-key"],
  maxAge: 31_536_000, // one year
  httpOnly: false, // Allow JavaScript access
});