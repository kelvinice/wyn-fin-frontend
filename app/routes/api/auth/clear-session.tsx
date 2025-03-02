import { authTokenCookie, userDataCookie, authExpirationCookie } from "~/cookies.server";

export async function action() {
  try {
    // Clear all auth cookies by setting them to empty with max-age=0
    const tokenCookie = await authTokenCookie.serialize("", { maxAge: 0 });
    const userCookie = await userDataCookie.serialize("", { maxAge: 0 });
    const expiryCookie = await authExpirationCookie.serialize("", { maxAge: 0 });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [tokenCookie, userCookie, expiryCookie]
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