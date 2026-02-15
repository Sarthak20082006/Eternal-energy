/**
 * Build pagination response
 */
function paginateResults(total, page, limit) {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
    };
}

/**
 * Generate invoice number
 */
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EE-${year}${month}-${random}`;
}

module.exports = {
    paginateResults,
    generateInvoiceNumber,
};
