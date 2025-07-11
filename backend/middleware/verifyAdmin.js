import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role != 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }

      req.user = decoded;
      next();

    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

export default verifyAdmin;