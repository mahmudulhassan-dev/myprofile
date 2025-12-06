import { ActivityLog } from '../models/index.js';

const activityLogger = async (req, res, next) => {
    // Only log state-changing methods (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const originalSend = res.send;

        res.send = function (data) {
            res.send = originalSend; // Restore
            originalSend.apply(res, arguments); // Send response

            // Async Log (Don't block response)
            if (res.statusCode >= 200 && res.statusCode < 400) {
                try {
                    const logData = {
                        action: `${req.method} ${req.originalUrl}`,
                        description: `User ${req.user ? req.user.username : 'Guest'} performed action.`,
                        ip_address: req.ip,
                        user_agent: req.get('User-Agent')
                    };
                    ActivityLog.create(logData).catch(err => console.error("Log Error:", err));
                } catch (e) {
                    console.error("Logging Middleware Error", e);
                }
            }
        };
    }
    next();
};

export default activityLogger;
