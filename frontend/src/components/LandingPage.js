import './LandingPage.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const LandingPage = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('documentUpdate', (updatedDocument) => {
            setDocuments((prevDocuments) =>
                prevDocuments.map((doc) =>
                    doc._id === updatedDocument._id ? updatedDocument : doc
                )
            );
        });

        return () => {
            socket.off('connect');
            socket.off('documentUpdate');
        };
    }, []);

    return (
        <div className="mt-5">
            <div className="p-5">
                <h1 className="display-4">Welcome to CollabTool</h1>
                <p className="lead">
                    CollabTool is your go-to platform for seamless real-time collaboration. 
                    Work together on documents, share ideas, and communicate effortlessly with your team.
                </p>
                <hr className="my-4" />
                <p className='p-6'>
                    Whether you're working on a team project or just need to organize your thoughts, 
                    CollabTool offers all the features you need to stay productive.
                </p>
                <div className="mt-4">
                    <Link to="/register" className="btn btn-primary btn-lg me-3">Register</Link>
                    <Link to="/login" className="btn btn-danger btn-lg me-4">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;