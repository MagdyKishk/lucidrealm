import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        
        // Log based on status code
        if (res.statusCode >= 500) {
            Logger.error(message);
        } else if (res.statusCode >= 400) {
            Logger.warn(message);
        } else {
            Logger.http(message);
        }
    });

    next();
}; 