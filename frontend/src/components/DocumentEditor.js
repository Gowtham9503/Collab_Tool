import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import './DocumentEditor.css';
import { useLayout } from '../contexts/LayoutContext';
import VersionHistory from './VersionHistory';
import ShareDocument from './ShareDocument';

const socket = io('http://localhost:5000');

const DocumentEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setShowFooter } = useLayout();
    const [document, setDocument] = useState(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setShowFooter(false); // Hide footer when entering editor
        return () => setShowFooter(true); // Show footer when leaving editor
    }, [setShowFooter]);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user ? user.token : null;
                const response = await axios.get(`http://localhost:5000/api/documents/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocument(response.data);
                setContent(response.data.content);
                setComments(response.data.comments); // Set comments in state
            } catch (error) {
                setError('Failed to fetch document');
            }
        };
        fetchDocument();
    }, [id]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        socket.emit('documentUpdate', id, e.target.value);
    };

    const saveDocument = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            await axios.put(`http://localhost:5000/api/documents/${id}`, { title: document.title, content }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage('Document saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            setError('Failed to save document');
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const addComment = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const response = await axios.post(`http://localhost:5000/api/comments/${id}`, { content: newComment }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setComments([...comments, response.data]);
            setNewComment('');
            socket.emit('comment', id, response.data);
            setSuccessMessage('Comment added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            setError('Failed to add comment');
        }
    };

    const handleDelete = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            await axios.delete(`http://localhost:5000/api/documents/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/dashboard');
        } catch (error) {
            setError('Failed to delete document');
        }
    };

    return (
        <div className="document-editor-container">
            <h2>Edit Document</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form>
                <table className="document-table">
                    <tbody>
                        <tr>
                            <td><label htmlFor="title" className="form-label">Title</label></td>
                            <td>
                                <input type="text" className="form-control" id="title" value={document?.title} onChange={(e) => {
                                    setDocument({ ...document, title: e.target.value });
                                    socket.emit('documentUpdate', id, e.target.value);
                                }} required />
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="content" className="form-label">Content</label></td>
                            <td>
                                <textarea className="form-control" id="content" value={content} onChange={handleContentChange} required />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" className="save-button" onClick={saveDocument}>Save</button>
                <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>
            </form>

            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <strong>{comment.author?.name || 'Unknown'}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>
                <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment"
                    className="comment-input"
                />
                <button type="button" onClick={addComment} className="add-comment-button">Add Comment</button>
            </div>

            <div className="additional-sections">
                {/* Add Version History */}
                <VersionHistory versions={document?.versions || []} />

                {/* Add Share Document */}
                <ShareDocument documentId={id} />
            </div>
        </div>
    );
};

export default DocumentEditor;