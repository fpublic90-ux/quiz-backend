const admin = require('firebase-admin');

/**
 * Middleware to verify Firebase ID tokens.
 * Extracts the token from the "Authorization" header.
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Unauthorized request: No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach the uid to the request object for use in routes
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };

        // If the route expects `req.body.uid`, ensure it matches the token
        // This prevents spoofing other users' UIDs
        if (req.body && req.body.uid && req.body.uid !== req.user.uid) {
            console.warn(`Spoof attempt: Token UID ${req.user.uid} tried to act as ${req.body.uid}`);
            return res.status(403).json({ message: 'Forbidden: UID mismatch' });
        }

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = { verifyToken };
