import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined!");
}

const app = express();

// Logger middleware (development)
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', //Frontend origin
    credentials: true, //Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], //Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] //Allowed headers
}));


// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);


// Healthcheck
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running!',
        timeStamp: new Date().toISOString()
    })
})

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;