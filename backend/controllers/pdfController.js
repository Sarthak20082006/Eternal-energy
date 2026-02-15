const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');

exports.generateInvoicePDF = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const customer = await Customer.findByPk(invoice.customerId);
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=invoice-${invoice.invoiceNumber}.pdf`);
        doc.pipe(res);

        // Colors
        const green = '#059669';
        const dark = '#0f172a';
        const gray = '#64748b';
        const lightGray = '#f1f5f9';

        // Header bar
        doc.rect(0, 0, 595, 100).fill(dark);
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#ffffff').text('ETERNAL ENERGY', 50, 30);
        doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text('Solar Business Platform', 50, 55);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(green).text('TAX INVOICE', 400, 30);
        doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text(`#${invoice.invoiceNumber}`, 400, 48);
        doc.fillColor('#94a3b8').text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`, 400, 62);
        if (invoice.dueDate) {
            doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}`, 400, 76);
        }

        // Company & Customer Info
        const y1 = 120;
        doc.fontSize(8).font('Helvetica-Bold').fillColor(gray).text('FROM', 50, y1);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(dark).text('Eternal Energy Pvt. Ltd.', 50, y1 + 14);
        doc.fontSize(8).font('Helvetica').fillColor(gray).text('123 Solar Avenue, Green Tech Park', 50, y1 + 28);
        doc.fontSize(8).text('Mumbai, Maharashtra 400001', 50, y1 + 40);
        doc.fontSize(8).text('GSTIN: 27AABCE1234F1Z5', 50, y1 + 52);

        doc.fontSize(8).font('Helvetica-Bold').fillColor(gray).text('BILL TO', 350, y1);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(dark).text(customer?.name || 'Customer', 350, y1 + 14);
        doc.fontSize(8).font('Helvetica').fillColor(gray).text(customer?.city || '', 350, y1 + 28);
        doc.fontSize(8).text(customer?.phone || '', 350, y1 + 40);
        doc.fontSize(8).text(customer?.email || '', 350, y1 + 52);

        // Status badge
        const status = invoice.paymentStatus.toUpperCase();
        const statusColor = invoice.paymentStatus === 'paid' ? green : invoice.paymentStatus === 'overdue' ? '#ef4444' : '#f59e0b';
        doc.roundedRect(350, y1 + 64, 70, 18, 4).fill(statusColor);
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#ffffff').text(status, 355, y1 + 69, { width: 60, align: 'center' });

        // Items table
        const tableTop = y1 + 100;
        const items = invoice.items || [];

        // Header row
        doc.rect(50, tableTop, 495, 28).fill(dark);
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff');
        doc.text('#', 60, tableTop + 9);
        doc.text('DESCRIPTION', 85, tableTop + 9);
        doc.text('QTY', 330, tableTop + 9, { width: 50, align: 'center' });
        doc.text('UNIT PRICE', 380, tableTop + 9, { width: 70, align: 'right' });
        doc.text('AMOUNT', 460, tableTop + 9, { width: 80, align: 'right' });

        // Item rows
        let y = tableTop + 28;
        items.forEach((item, i) => {
            const bg = i % 2 === 0 ? '#ffffff' : lightGray;
            doc.rect(50, y, 495, 24).fill(bg);
            doc.fontSize(8).font('Helvetica').fillColor(dark);
            doc.text(String(i + 1), 60, y + 7);
            doc.text(item.description || '', 85, y + 7, { width: 230 });
            doc.text(String(item.quantity || 1), 330, y + 7, { width: 50, align: 'center' });
            doc.text(`₹${(item.unitPrice || 0).toLocaleString('en-IN')}`, 380, y + 7, { width: 70, align: 'right' });
            doc.text(`₹${((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString('en-IN')}`, 460, y + 7, { width: 80, align: 'right' });
            y += 24;
        });

        // Totals section
        y += 10;
        const totalsX = 370;

        const drawTotal = (label, value, bold = false) => {
            doc.fontSize(9).font(bold ? 'Helvetica-Bold' : 'Helvetica').fillColor(dark);
            doc.text(label, totalsX, y, { width: 90, align: 'right' });
            doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fillColor(bold ? green : dark);
            doc.text(`₹${value.toLocaleString('en-IN')}`, 470, y, { width: 70, align: 'right' });
            y += 18;
        };

        drawTotal('Subtotal', invoice.subtotal);
        if (invoice.discountAmount > 0) drawTotal(`Discount (${invoice.discountPercent}%)`, -invoice.discountAmount);
        drawTotal(`GST (${invoice.gstRate}%)`, invoice.gstAmount);

        doc.moveTo(totalsX, y).lineTo(545, y).stroke(dark);
        y += 6;
        drawTotal('TOTAL', invoice.totalAmount, true);

        // Footer
        const footerY = 750;
        doc.moveTo(50, footerY).lineTo(545, footerY).stroke('#e2e8f0');
        doc.fontSize(8).font('Helvetica').fillColor(gray);
        doc.text('Thank you for choosing Eternal Energy for your solar needs!', 50, footerY + 10);
        doc.text('Terms: Payment due within 30 days of invoice date.', 50, footerY + 22);
        doc.fontSize(7).fillColor('#94a3b8').text('Generated by Eternal Energy Solar Platform', 50, footerY + 40);

        doc.end();
    } catch (error) {
        next(error);
    }
};
