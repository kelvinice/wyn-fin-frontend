import { authTokenCookie, userDataCookie, authExpirationCookie } from "~/cookies.server";

export async function action() {
  try {
    // Clear all auth cookies by setting them to empty and expiring them
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [
          await authTokenCookie.serialize("", { maxAge: 0 }),
          await userDataCookie.serialize("", { maxAge: 0 }),
          await authExpirationCookie.serialize("", { maxAge: 0 })
        ]
      }
    });
  } catch (error) {
    console.error("Error clearing auth session:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to clear auth session"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}