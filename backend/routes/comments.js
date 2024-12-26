const express = require('express');
const Comment = require('../models/Comment');
const Document = require('../models/Document');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all comments for a document
router.get('/:documentId', verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({ document: req.params.documentId }).populate('author', 'name');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new comment to a document
router.post('/:documentId', verifyToken, async (req, res) => {
    const { content } = req.body;
    try {
        const document = await Document.findById(req.params.documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const newComment = new Comment({
            content,
            author: req.user.id,
            document: req.params.documentId,
        });

        await newComment.save();

        document.comments.push(newComment._id);
        await document.save();

        res.json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a comment
router.delete('/:commentId', verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.remove();

        const document = await Document.findById(comment.document);
        document.comments.pull(comment._id);
        await document.save();

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;