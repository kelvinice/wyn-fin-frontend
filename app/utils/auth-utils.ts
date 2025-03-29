import { redirect } from "react-router";
import { authTokenCookie, userDataCookie } from "~/cookies.server";
import type { Route } from "../+types/root";

// Enhanced loader for authenticated routes with SSR support
export function createProtectedLoader(
  customLoader?: (args: Route.LoaderArgs) => Promise<any> | any,
  redirectTo = "/auth/login"
) {
  return async (args: Route.LoaderArgs) => {
    const { request } = args;
    const cookieHeader = request.headers.get("Cookie");
    
    // Check for auth token
    const token = await authTokenCookie.parse(cookieHeader);
    const userDataStr = await userDataCookie.parse(cookieHeader);
    
    // If no token or user data, redirect to login
    if (!token || !userDataStr) {
      const url = new URL(request.url);
      return redirect(`${redirectTo}?from=${encodeURIComponent(url.pathname)}`);
    }
    
    // If custom loader provided, call it with the args
    if (customLoader) {
      return customLoader(args);
    }
    
    return null;
  };
}