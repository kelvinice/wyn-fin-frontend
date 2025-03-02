import type { Route } from "../+types/home";

// Handle POST requests
export async function action({ request }: Route.ActionArgs) {
  return new Response(JSON.stringify({ 
    message: 'pong from action', 
    method: 'POST',
    timestamp: new Date().toISOString()
  }), {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

// Handle GET requests
export async function loader({ request }: Route.LoaderArgs) {
  return new Response(JSON.stringify({ 
    message: 'pong from loader', 
    method: 'GET',
    timestamp: new Date().toISOString()
  }), { 
    headers: { "Content-Type": "application/json" }
  });
}