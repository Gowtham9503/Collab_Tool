const express = require('express');
const Document = require('../models/Document');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all documents for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single document by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new document
router.post('/', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newDocument = await Document.create({
            title,
            content,
            owner: req.user.id,
            versions: [{ content }],
        });
        res.json(newDocument);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a document
router.put('/:id', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        document.title = title;
        document.content = content;
        document.versions.push({ content });
        await document.save();
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a document
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Share a document
router.post('/share', verifyToken, async (req, res) => {
    const { documentId, email } = req.body;
    try {
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ message: 'Document shared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;