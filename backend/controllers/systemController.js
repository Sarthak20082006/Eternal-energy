const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');

// @route GET /api/system/backup
exports.backupDB = async (req, res, next) => {
    try {
        const dbPath = path.join(__dirname, '..', 'data', 'eternal_energy.db');
        if (!fs.existsSync(dbPath)) {
            return res.status(404).json({ success: false, message: 'Database file not found' });
        }
        const backupDir = path.join(__dirname, '..', 'data', 'backups');
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup_${timestamp}.db`);
        fs.copyFileSync(dbPath, backupPath);

        res.json({ success: true, message: 'Backup created', filename: `backup_${timestamp}.db` });
    } catch (error) { next(error); }
};

// @route GET /api/system/backups
exports.listBackups = async (req, res, next) => {
    try {
        const backupDir = path.join(__dirname, '..', 'data', 'backups');
        if (!fs.existsSync(backupDir)) return res.json({ success: true, data: [] });

        const files = fs.readdirSync(backupDir)
            .filter(f => f.endsWith('.db'))
            .map(f => ({
                filename: f,
                size: Math.round(fs.statSync(path.join(backupDir, f)).size / 1024) + ' KB',
                created: fs.statSync(path.join(backupDir, f)).mtime,
            }))
            .sort((a, b) => new Date(b.created) - new Date(a.created));

        res.json({ success: true, data: files });
    } catch (error) { next(error); }
};

// @route POST /api/system/restore/:filename
exports.restoreDB = async (req, res, next) => {
    try {
        const backupDir = path.join(__dirname, '..', 'data', 'backups');
        const backupPath = path.join(backupDir, req.params.filename);
        const dbPath = path.join(__dirname, '..', 'data', 'eternal_energy.db');

        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ success: false, message: 'Backup not found' });
        }

        await sequelize.close();
        fs.copyFileSync(backupPath, dbPath);
        await sequelize.authenticate();

        res.json({ success: true, message: 'Database restored. Please restart the server.' });
    } catch (error) { next(error); }
};

// @route GET /api/system/health
exports.systemHealth = async (req, res, next) => {
    try {
        const dbPath = path.join(__dirname, '..', 'data', 'eternal_energy.db');
        const dbSize = fs.existsSync(dbPath)
            ? Math.round(fs.statSync(dbPath).size / 1024) + ' KB'
            : '0 KB';

        res.json({
            success: true,
            data: {
                uptime: Math.round(process.uptime()) + 's',
                memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
                nodeVersion: process.version,
                database: 'SQLite',
                dbSize,
                environment: process.env.NODE_ENV,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) { next(error); }
};
