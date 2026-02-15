const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'data', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// @route POST /api/upload
// Simple base64 file upload (no multer dependency needed)
router.post('/', protect, (req, res, next) => {
    try {
        const { filename, data, mimeType } = req.body;
        if (!filename || !data) {
            return res.status(400).json({ success: false, message: 'filename and data (base64) required' });
        }

        // Validate file size (max 5MB)
        const buffer = Buffer.from(data, 'base64');
        if (buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: 'File too large (max 5MB)' });
        }

        // Sanitize filename
        const ext = path.extname(filename).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.csv', '.xlsx', '.doc', '.docx'];
        if (!allowed.includes(ext)) {
            return res.status(400).json({ success: false, message: `File type ${ext} not allowed` });
        }

        const safeName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, buffer);

        res.json({
            success: true,
            data: {
                filename: safeName,
                originalName: filename,
                size: buffer.length,
                mimeType: mimeType || 'application/octet-stream',
                url: `/api/upload/files/${safeName}`,
            },
        });
    } catch (error) { next(error); }
});

// @route GET /api/upload/files/:filename
router.get('/files/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    res.sendFile(filePath);
});

// @route GET /api/upload
router.get('/', protect, (req, res) => {
    if (!fs.existsSync(uploadDir)) return res.json({ success: true, data: [] });

    const files = fs.readdirSync(uploadDir).map(f => ({
        filename: f,
        size: Math.round(fs.statSync(path.join(uploadDir, f)).size / 1024) + ' KB',
        uploaded: fs.statSync(path.join(uploadDir, f)).mtime,
        url: `/api/upload/files/${f}`,
    }));

    res.json({ success: true, data: files });
});

// @route DELETE /api/upload/:filename
router.delete('/:filename', protect, (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted' });
});

module.exports = router;
