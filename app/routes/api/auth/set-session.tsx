import type { Route } from "../../+types/home";
import { authTokenCookie, userDataCookie, authExpirationCookie } from "~/cookies.server";

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
    
    // Set individual cookies
    const tokenCookie = await authTokenCookie.serialize(token);
    const userCookie = await userDataCookie.serialize(JSON.stringify(userData));
    const expiryCookie = await authExpirationCookie.serialize(expirationTime);
    
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