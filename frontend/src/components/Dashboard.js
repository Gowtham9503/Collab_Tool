import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
const API_URL = 'http://localhost:5000/api/documents';
const user = JSON.parse(localStorage.getItem('user'));
const token = user ? user.token : null;

export const getDocuments = async () => {
    const { data } = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const getDocumentById = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const updateDocument = async (id, documentData) => {
    const { data } = await axios.put(`${API_URL}/${id}`, documentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

export const deleteDocument = async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
};

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user ? user.token : null;
                const { data } = await axios.get('http://localhost:5000/api/documents', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocuments(data);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
                setError('An unexpected error occurred. Please try again later.');
            }
        };
        fetchDocuments();
    }, []);

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="document-list">
                {documents.map((doc) => (
                    <div key={doc._id} className="document-card">
                        <div className="document-card-body">
                            <h5 className="document-card-title">{doc.title}</h5>
                            <p className="document-card-text">Created on: {new Date(doc.createdAt).toLocaleDateString()}</p>
                            <Link to={`/documents/${doc._id}`} className="document-link">Open Document</Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="create-document-button-container">
                <button className="create-document-button" onClick={() => navigate('/documents/new')}>Create New Document</button>
            </div>
        </div>
    );
};

export default Dashboard;