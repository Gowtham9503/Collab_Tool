const express = require('express');
const Document = require('../models/Document');
const verifyToken = require('../middleware/auth'); // Ensure this is correctly imported
const router = express.Router();

// Get all documents for the logged-in user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const documents = await Document.find({ owner: req.user.id });
    res.json(documents);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Get a document by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name'
        }
      });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document' });
  }
});

// Create a new document
router.post('/', verifyToken, async (req, res, next) => {
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
    next(error); // Pass the error to the error handling middleware
  }
});

// Update a document by ID
router.put('/:id', verifyToken, async (req, res, next) => {
  const { content } = req.body;
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.content = content;
    await document.save();

    res.json(document);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Delete a document
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Share a document
router.post('/share', verifyToken, async (req, res, next) => {
  const { documentId, email } = req.body;
  try {
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json({ message: 'Document shared successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;