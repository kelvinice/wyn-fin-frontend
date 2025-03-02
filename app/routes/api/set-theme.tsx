import { redirect } from "react-router";
import type { Route } from "../+types/home";
import { themeCookie } from "~/cookies.server";

export async function action({ request }: Route.ActionArgs) {
  try {
    // Get the current cookie value
    const cookieHeader = request.headers.get("Cookie");
    const cookieValue = await themeCookie.parse(cookieHeader) || {};
    
    // Get the new theme from the form data
    const formData = await request.formData();
    const theme = formData.get("theme") as "light" | "dark";
    
    if (theme !== "light" && theme !== "dark") {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Invalid theme value" 
      }), { 
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    // Set the theme in the cookie
    cookieValue.theme = theme;
    
    // Return the response with the updated cookie
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [tokenCookie, userCookie, expiryCookie].join(", ")
      }
    });
  } catch (error) {
    console.error("Error setting theme:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to set theme"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}