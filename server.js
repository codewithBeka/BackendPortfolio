import express from 'express';
import cookieParser  from "cookie-parser"
import bodyParser  from "body-parser"
import dbConnect from "./config/dbConnect.js"
import dotenv from "dotenv";
import cors from "cors"
import path from "path"
import WebSocket, { WebSocketServer } from 'ws';


import userRoutes from "./routers/userRouters.js"
import uploadRouter from "./routers/uploadRoute.js"
import categoryRoutes from './routers/categoryRoutes.js';
import projectRoutes from './routers/projectRoutes.js';
import skillsRoutes from './routers/skillsRoutes.js';
import admin from './config/firebaseAdmin.js';
import messageRoutes from './routers/messageRoutes.js';
import testimonialRoutes from './routers/testimonialRoutes.js';

dotenv.config();

dbConnect();

const PORT = 8000;
const app = express();

// Define allowed origins
const allowedOrigins = [
    "http://localhost:5173", // Your frontend development URL
    "http://localhost:3000",    // Add other allowed origins here
    "https://codewithbereket.vercel.app/"
];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};



app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRouter);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/testimonials', testimonialRoutes);



const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));


// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Upgrade server to handle WebSocket connections
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Function to send notifications to all connected clients
export const sendNotification = (contact) => {
    const message = JSON.stringify({ type: 'contact', data: contact });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// export const sendBackgroundNotification = async (title, body, contact) => {
//     try {
//         const tokensSnapshot = await admin.firestore().collection('tokens').get();
//         const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

//         if (!tokens || tokens.length === 0) {
//             console.warn('No tokens available for notification. Please ensure users are subscribed.');
//             return;
//         }
        

//         // Create an array of messages for each token
//         const messages = tokens.map(token => ({
//             token: token,
//             notification: {
//                 title: title,
//                 body: body,
//             },
//             data: {
//                 contact: String(contact), 
//             },
//         }));


//         // Send notifications
        
//         const response = await admin.messaging().sendEach(messages)
//         console.log('Notification sent successfully:', response);

//         // Check for failures in the response
//         response.responses.forEach(async (res, index) => {
//             if (!res.success) {
//                 console.error(`Failed to send notification to token ${tokens[index]}:`, res.error.message || res.error);
//                 // Check for specific error codes
//                 if (res.error.code === 'messaging/registration-token-not-registered') {
//                     // Remove invalid token from Firestore
//                     const tokenDocRef = admin.firestore().collection('tokens').doc(tokens[index]);
//                     await tokenDocRef.delete();
//                     console.log(`Removed invalid token: ${tokens[index]}`);
//                 }
//             }
//         });

//         // If there are failures, log them for further investigation
//         const failedTokens = response.responses
//             .map((res, index) => (!res.success ? tokens[index] : null))
//             .filter(token => token !== null);

//         if (failedTokens.length > 0) {
//             console.warn('Some notifications failed to send:', failedTokens);
//         }

//     } catch (error) {
//         console.error('An error occurred while sending notifications:', error.message || error);
//     }
// };