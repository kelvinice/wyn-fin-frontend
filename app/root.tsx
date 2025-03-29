import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "./components/common/theme-context";
import { ToastProvider } from "./components/common/toast-context";
import { AuthProvider } from "./components/auth/components/auth-provider";
import { themeCookie, authTokenCookie, userDataCookie } from "./cookies.server";
import { AuthCookieProvider } from "./components/auth/components/auth-cookie-context";
import type { User } from "./components/auth/core/models";
import { ServiceProvider } from '~/components/services/service-provider';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Add root loader to get auth state from cookies
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  
  // Get theme preference
  const themeCookieData = await themeCookie.parse(cookieHeader) || {};
  
  // Get auth state
  const tokenData = await authTokenCookie.parse(cookieHeader);
  const userDataStr = await userDataCookie.parse(cookieHeader);
  
  let userData = null;
  if (userDataStr) {
    try {
      userData = JSON.parse(userDataStr);
    } catch (error) {
      console.error("Failed to parse user data from cookie:", error);
    }
  }
  
  return new Response(JSON.stringify({
    theme: themeCookieData.theme || "light",
    isAuthenticated: !!tokenData && !!userData,
    user: userData,
    token: tokenData
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Update the default function App() to include AuthCookieProvider

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const loaderData = useLoaderData<{
    theme: "light" | "dark",
    isAuthenticated: boolean,
    user: User | null,
    token: string | null
  }>();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialAuthState={{
        user: loaderData?.user || null,
        token: loaderData?.token || null,
        isAuthenticated: loaderData?.isAuthenticated || false
      }}>
        <AuthCookieProvider>
          <ThemeProvider initialTheme={loaderData?.theme || "light"}>
            <ToastProvider>
              <ServiceProvider>
                <Outlet />
              </ServiceProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthCookieProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}