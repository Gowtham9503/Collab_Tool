// importing packages
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
//importing db config
const connectDB = require('./config/db');
//importing routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const commentRoutes = require('./routes/comments'); 

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Configure CORS for HTTP requests
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware and routes
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/comments', commentRoutes); 

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('joinDocument', (documentId, userId) => {
        socket.join(documentId);
        io.to(documentId).emit('userJoined', userId);
        console.log(`User ${userId} joined document: ${documentId}`);
    });

    socket.on('leaveDocument', (documentId, userId) => {
        socket.leave(documentId);
        io.to(documentId).emit('userLeft', userId);
        console.log(`User ${userId} left document: ${documentId}`);
    });

    socket.on('documentUpdate', (documentId, content) => {
        socket.to(documentId).emit('documentUpdate', content);
    });

    socket.on('comment', (documentId, comment) => {
        io.to(documentId).emit('comment', comment);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});