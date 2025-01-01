import React, { useState } from 'react';
import './ShareDocument.css';

const ShareDocument = ({ documentId }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleShare = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:5000/api/documents/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ documentId, email })
            });
            
            if (response.ok) {
                setMessage('Document shared successfully!');
                setEmail('');
            }
        } catch (error) {
            setMessage('Failed to share document');
        }
    };

    return (
        <div className="share-document">
            <h3>Share Document</h3>
            <div className="share-form">
                <input
                    type="email"
                    placeholder="Enter email to share with"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleShare}>Share</button>
            </div>
            {message && <p className="share-message">{message}</p>}
        </div>
    );
};

export default ShareDocument;