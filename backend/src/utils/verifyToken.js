import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
    // Fetch user and check role
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error in admin verification' });
  }
};
