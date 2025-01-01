const express = require('express');
const Comment = require('../models/Comment');
const Document = require('../models/Document');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Get all comments for a document
router.get('/:documentId', verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({ document: req.params.documentId })
            .populate('author', 'name');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

// Add a comment
router.post('/:documentId', verifyToken, async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            document: req.params.documentId,
            author: req.user.id
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment' });
    }
});

// Delete a comment
router.delete('/:commentId', verifyToken, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

module.exports = router;