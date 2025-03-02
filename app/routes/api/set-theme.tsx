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
    return new Response(JSON.stringify({ success: true, theme }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await themeCookie.serialize(cookieValue)
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

// Add a loader function to handle GET requests (optional)
export async function loader() {
  return new Response(JSON.stringify({ 
    message: "This endpoint only accepts POST requests" 
  }), { 
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}