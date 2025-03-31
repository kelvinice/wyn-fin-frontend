import type { ActionFunction } from 'react-router';
import { authTokenCookie, userDataCookie, authExpirationCookie, refreshTokenCookie } from '~/cookies.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get('token')?.toString();
  const userDataStr = formData.get('userData')?.toString();
  const expiresInStr = formData.get('expiresIn')?.toString();
  const refreshToken = formData.get('refreshToken')?.toString();
  
  if (!token || !userDataStr || !expiresInStr) {
    return Response.json({
      success: false,
      message: "Missing required fields",
    }, { status: 400 });
  }
  
  try {
    // Parse the user data
    const userData = JSON.parse(userDataStr);
    
    // Calculate expiration date
    const expiresIn = parseInt(expiresInStr, 10);
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    
    // Prepare cookies
    const cookies = [
      await authTokenCookie.serialize(token),
      await userDataCookie.serialize(userDataStr),
      await authExpirationCookie.serialize(expirationDate.toISOString()),
    ];
    
    // Add refresh token if provided
    if (refreshToken) {
      cookies.push(await refreshTokenCookie.serialize(refreshToken));
    }
    
    return Response.json({ success: true }, {
      headers: {
        'Set-Cookie': cookies.join(', ')
      }
    });
    
  } catch (error) {
    console.error('Error setting session:', error);
    return Response.json({
      success: false,
      message: 'Error setting session',
    }, { status: 500 });
  }
};