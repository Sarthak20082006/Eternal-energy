// Mock Email Service — simulates sending emails by logging to console and file
// In production, replace with real Nodemailer transport (SMTP, SendGrid, etc.)

const fs = require('fs');
const path = require('path');

const emailLogPath = path.join(__dirname, '..', 'data', 'email_log.json');

const ensureLogFile = () => {
    if (!fs.existsSync(emailLogPath)) {
        const dir = path.dirname(emailLogPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(emailLogPath, '[]');
    }
};

const logEmail = (emailData) => {
    ensureLogFile();
    const logs = JSON.parse(fs.readFileSync(emailLogPath, 'utf-8'));
    logs.push({ ...emailData, sentAt: new Date().toISOString(), id: Date.now() });
    if (logs.length > 200) logs.splice(0, logs.length - 200); // Keep last 200
    fs.writeFileSync(emailLogPath, JSON.stringify(logs, null, 2));
};

exports.sendInvoiceEmail = async (to, invoiceData) => {
    const email = {
        type: 'invoice',
        to,
        subject: `Invoice ${invoiceData.invoiceNumber} from Eternal Energy`,
        body: `Dear Customer,\n\nPlease find your invoice ${invoiceData.invoiceNumber} for ₹${invoiceData.totalAmount?.toLocaleString()}.\n\nPayment Status: ${invoiceData.paymentStatus}\n\nThank you for choosing Eternal Energy!\n\nBest regards,\nEternal Energy Team`,
        status: 'sent',
    };
    logEmail(email);
    console.log(`📧 [MOCK EMAIL] Invoice sent to ${to}: ${email.subject}`);
    return email;
};

exports.sendLeadNotification = async (to, leadData) => {
    const email = {
        type: 'lead_notification',
        to,
        subject: `New Lead: ${leadData.name} — ${leadData.systemSize}kW System`,
        body: `New lead received!\n\nName: ${leadData.name}\nPhone: ${leadData.phone}\nCity: ${leadData.city}\nSystem Size: ${leadData.systemSize} kW\nPanel: ${leadData.panelName}\nEstimated Price: ₹${leadData.totalPrice?.toLocaleString()}\n\nPlease follow up within 24 hours.`,
        status: 'sent',
    };
    logEmail(email);
    console.log(`📧 [MOCK EMAIL] Lead notification to ${to}: ${email.subject}`);
    return email;
};

exports.sendWelcomeEmail = async (to, name) => {
    const email = {
        type: 'welcome',
        to,
        subject: `Welcome to Eternal Energy, ${name}!`,
        body: `Hi ${name},\n\nWelcome to Eternal Energy — India's trusted solar energy platform.\n\nYour account has been created successfully. Start exploring our solar solutions today!\n\nBest regards,\nEternal Energy Team`,
        status: 'sent',
    };
    logEmail(email);
    console.log(`📧 [MOCK EMAIL] Welcome email to ${to}: ${email.subject}`);
    return email;
};

exports.sendMaintenanceReminder = async (to, installationData) => {
    const email = {
        type: 'maintenance_reminder',
        to,
        subject: `Maintenance Reminder — ${installationData.systemSize}kW System`,
        body: `Dear Customer,\n\nThis is a reminder that your ${installationData.systemSize}kW solar system at ${installationData.siteAddress} is due for maintenance.\n\nScheduled maintenance includes:\n- Panel cleaning\n- Inverter check\n- Wiring inspection\n- Performance analysis\n\nPlease contact us to schedule a visit.\n\nBest regards,\nEternal Energy Team`,
        status: 'sent',
    };
    logEmail(email);
    console.log(`📧 [MOCK EMAIL] Maintenance reminder to ${to}`);
    return email;
};

// Get all email logs
exports.getEmailLogs = () => {
    ensureLogFile();
    return JSON.parse(fs.readFileSync(emailLogPath, 'utf-8'));
};
