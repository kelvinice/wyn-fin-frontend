
import type { ActionFunction } from 'react-router';
import { authTokenCookie, userDataCookie, authExpirationCookie, refreshTokenCookie } from '~/cookies.server';

export const action: ActionFunction = async ({ request }) => {
  try {
    // Get the refresh token from the cookie
    const cookieHeader = request.headers.get("Cookie");
    const refreshToken = await refreshTokenCookie.parse(cookieHeader);
    
    if (!refreshToken) {
      return Response.json({
        success: false,
        message: 'No refresh token found',
      }, { status: 401 });
    }
    
    // Call the backend API to refresh the token
    const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return Response.json({
        success: false,
        message: result.message || 'Failed to refresh token',
      }, { status: response.status });
    }
    
    // Parse user data from existing cookie to keep it in sync
    const userDataString = await userDataCookie.parse(cookieHeader);
    let userData = null;
    
    if (userDataString) {
      try {
        userData = JSON.parse(userDataString);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return Response.json({
          success: false,
          message: 'Failed to parse user data',
        }, { status: 500 });
      }
    }
    
    if (!userData) {
      return Response.json({
        success: false,
        message: 'User data not found',
      }, { status: 401 });
    }
    
    // Calculate expiration date
    const expiresIn = result.expiresIn;
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    
    // Prepare the response
    const responseData = {
      success: true,
      data: {
        token: result.accessToken,
        expiresIn: result.expiresIn,
        user: userData,
      }
    };
    
    // Set the new cookies
    return Response.json(responseData, {
      headers: {
        'Set-Cookie': [
          await authTokenCookie.serialize(result.accessToken),
          await refreshTokenCookie.serialize(result.refreshToken),
          await userDataCookie.serialize(JSON.stringify(userData)),
          await authExpirationCookie.serialize(expirationDate.toISOString()),
        ].join(', '),
      },
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    return Response.json({
      success: false,
      message: 'Error refreshing token',
    }, { status: 500 });
  }
};