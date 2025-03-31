import { authTokenCookie, userDataCookie, authExpirationCookie, refreshTokenCookie } from "~/cookies.server";

export async function action() {
  try {
    const token = await authTokenCookie.serialize("", { maxAge: 0 });
    const user = await userDataCookie.serialize("", { maxAge: 0 });
    const expiry = await authExpirationCookie.serialize("", { maxAge: 0 });
    const refreshToken = await refreshTokenCookie.serialize("", { maxAge: 0 });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [token, user, expiry, refreshToken]
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