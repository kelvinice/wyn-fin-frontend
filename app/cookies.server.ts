import { createCookie } from "react-router";

// Common cookie options to ensure consistency
const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.COOKIE_SECRET || "dev-secret-key"],
};

export const themeCookie = createCookie("theme-pref", {
  ...cookieOptions,
  maxAge: 31_536_000, // one year
  httpOnly: false, // Allow JavaScript access for theme
});

export const authTokenCookie = createCookie("auth-token", {
  ...cookieOptions,
  maxAge: 604_800, // one week
  httpOnly: true, // More secure
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