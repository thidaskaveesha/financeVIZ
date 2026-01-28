import { verifyJWT } from '../utils/security.js';
import { supabase } from '../config/database.js';

/**
 * Authentication middleware - verifies access token
 * Adds user data to req.user for authenticated routes
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate access token length (10 characters)
    if (accessToken.length !== 10) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Verify access token exists in user table
    const { data: user, error } = await supabase
      .from('user')
      .select('user_id, username, subscription_level, email_verified')
      .eq('access_token', accessToken)
      .single();

    if (!user || error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified'
      });
    }

    // Attach user info to request object
    req.user = {
      userId: user.user_id,
      username: user.username,
      subscriptionLevel: user.subscription_level
    };

    next();

    /* JWT TOKEN IMPLEMENTATION (COMMENTED OUT)
    // Verify JWT token
    const decoded = verifyJWT(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify user still exists and token matches (optional double-check)
    const { data: user, error } = await supabase
      .from('user')
      .select('user_id, username, subscription_level, email_verified')
      .eq('user_id', decoded.userId)
      .single();

    if (!user || error) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified'
      });
    }

    // Attach user info to request object
    req.user = {
      userId: user.user_id,
      username: user.username,
      subscriptionLevel: user.subscription_level
    };

    next();
    */
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};
