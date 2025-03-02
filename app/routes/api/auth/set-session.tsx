import { authTokenCookie, userDataCookie, authExpirationCookie } from "~/cookies.server";
import type { Route } from "../../+types/home";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;
    const userDataStr = formData.get("userData") as string;
    const expiresInStr = formData.get("expiresIn") as string;
    
    if (!token || !userDataStr) {
      return new Response(JSON.stringify({
        success: false,
        message: "Invalid auth data"
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }
    
    const userData = JSON.parse(userDataStr);
    const expiresIn = parseInt(expiresInStr, 10);
    const expirationTime = new Date(Date.now() + expiresIn * 1000).toISOString();
    
    // Calculate cookie max age in seconds
    const maxAge = expiresIn;
    
    // Set cookies individually to avoid concatenation issues
    const tokenCookie = await authTokenCookie.serialize(token, {
      maxAge,
    });
    
    const userCookie = await userDataCookie.serialize(JSON.stringify(userData), {
      maxAge,
    });
    
    const expiryCookie = await authExpirationCookie.serialize(expirationTime, {
      maxAge,
    });
    
    // Make sure the cookies are being sent correctly
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [tokenCookie, userCookie, expiryCookie]
      }
    });
  } catch (error) {
    console.error("Error setting auth session:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to set auth session"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}