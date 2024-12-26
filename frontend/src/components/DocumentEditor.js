import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import './DocumentEditor.css';

const socket = io('http://localhost:5000');

const DocumentEditor = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchDocument = async () => {
            const response = await axios.get(`http://localhost:5000/api/documents/${id}`);
            setDocument(response.data);
            setContent(response.data.content);
        };

        const fetchComments = async () => {
            const response = await axios.get(`http://localhost:5000/api/comments/${id}`);
            setComments(response.data);
        };

        fetchDocument();
        fetchComments();

        socket.emit('joinDocument', id);

        socket.on('documentUpdate', (updatedContent) => {
            setContent(updatedContent);
        });

        socket.on('comment', (comment) => {
            setComments((prevComments) => [...prevComments, comment]);
        });

        return () => {
            socket.emit('leaveDocument', id);
            socket.off('documentUpdate');
            socket.off('comment');
        };
    }, [id]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        socket.emit('documentUpdate', id, e.target.value);
    };

    const saveDocument = async () => {
        await axios.put(`http://localhost:5000/api/documents/${id}`, { content });
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const addComment = async () => {
        const response = await axios.post(`http://localhost:5000/api/comments/${id}`, { content: newComment });
        setNewComment('');
        socket.emit('comment', id, response.data);
    };

    return (
        <div className="document-editor">
            <h2>{document?.title}</h2>
            <textarea value={content} onChange={handleContentChange} />
            <button onClick={saveDocument}>Save</button>
            <div className="comments-section">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id}>
                            <strong>{comment.author.name}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>
                <textarea value={newComment} onChange={handleCommentChange} placeholder="Add a comment" />
                <button onClick={addComment}>Add Comment</button>
            </div>
        </div>
    );
};

export default DocumentEditor;