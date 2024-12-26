const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    versions: [versionSchema],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    attachments: [{ type: String }], 
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);