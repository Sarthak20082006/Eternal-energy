const GST_RATE = 0.18;
const INSTALLATION_COST = 20000;

/**
 * Calculate solar installation pricing
 * @param {number} systemSize - System size in kW
 * @param {number} panelPricePerWatt - Panel price per watt (₹)
 * @param {number} inverterPrice - Inverter price (₹)
 * @param {number} structurePrice - Structure price (₹)
 * @returns {object} Pricing breakdown
 */
const calculatePricing = (systemSize, panelPricePerWatt, inverterPrice, structurePrice) => {
    const panelCost = systemSize * 1000 * panelPricePerWatt;
    const subtotal = panelCost + inverterPrice + structurePrice + INSTALLATION_COST;
    const gstAmount = Math.round(subtotal * GST_RATE);
    const totalWithGST = subtotal + gstAmount;

    return {
        panelCost,
        inverterPrice,
        structurePrice,
        installationCost: INSTALLATION_COST,
        subtotal,
        gstRate: GST_RATE,
        gstAmount,
        totalWithGST,
    };
};

module.exports = { calculatePricing };
