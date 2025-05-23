import './LandingPage.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getDocuments, deleteDocument } from '../services/documentService'; // Import the deleteDocument function

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

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const docs = await getDocuments();
                setDocuments(docs);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDocument(id);
            setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc._id !== id));
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    return (
        <div className="landing-page-container">
            <div className="landing-page-content">
                <h1 className="landing-page-title">Welcome to CollabTool</h1>
                <p className="landing-page-lead">
                    CollabTool is your go-to platform for seamless real-time collaboration. 
                    Work together on documents, share ideas, and communicate effortlessly with your team.
                </p>
                <hr className="landing-page-divider" />
                <p className="landing-page-description">
                    Whether you're working on a team project or just need to organize your thoughts, 
                    CollabTool offers all the features you need to stay productive.
                </p>
                <div className="landing-page-buttons">
                    <Link to="/register" className="landing-page-button primary">Register</Link>
                    <Link to="/login" className="landing-page-button danger">Login</Link>
                </div>
                <div className="document-list">
                    {documents.map((doc) => (
                        <div key={doc._id} className="document-card">
                            <h5>{doc.title}</h5>
                            <p>{doc.content}</p>
                            <button onClick={() => handleDelete(doc._id)} className="delete-button">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;