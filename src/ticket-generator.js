const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

/**
 * Generate a movie ticket PDF by overlaying dynamic data
 * @param {Object} data - The dynamic data to overlay on the ticket.
 * @param {Object} res - The HTTP response object.
 */
function generateTicket(data, res) {
    try {
        // Image dimensions (in pixels)
        const imageWidthPx = 2000; // Width in pixels
        const imageHeightPx = 647; // Height in pixels

        // Convert pixels to points (assuming 1px = 1pt for 72 DPI)
        const imageWidthPt = imageWidthPx;
        const imageHeightPt = imageHeightPx;

        const doc = new PDFDocument({
            size: [imageWidthPt, imageHeightPt], // Set PDF size to image size
            layout: 'portrait',
        });

        // Set the response header for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="movie_ticket.pdf"'); // Optional

        // Stream the PDF to the response
        doc.pipe(res);

        // Load the template image
        const templatePath = path.resolve(__dirname, '../templates/movie_ticket.png');
        if (fs.existsSync(templatePath)) {
            // Calculate the scaling for the image to fit the page size
            const scaledWidth = imageWidthPt; // Use the full width of the PDF
            const scaledHeight = imageHeightPt; // Use the full height of the PDF

            // Position the image at the top left corner
            doc.image(templatePath, 0, 0, { width: scaledWidth, height: scaledHeight });
        } else {
            console.warn('Template not found:', templatePath);
        }

        // Overlay dynamic data
       // Set font size and color
       const fixedWidth = 400;
doc.fontSize(155.5).fillColor('white'); // Set the color to white
// Add text with dynamic content
doc.text(`${data.movie || 'N/A'}`, 607.36, 263.36);
doc.fontSize(10);
doc.text(`Date & Time: ${data.date || 'N/A'} at ${data.time || 'N/A'}`, 50, 180);
doc.text(`Theater: ${data.theater || 'N/A'}`, 50, 210);
doc.text(`Tickets: ${data.tickets || 'N/A'}`, 50, 240);
doc.text(`Amount: $${data.amount || 'N/A'}`, 50, 270);

// Finalize the PDF
doc.end();

    } catch (error) {
        console.error('Error generating ticket:', error);
        res.status(500).send('Error generating ticket');
    }
}

module.exports = { generateTicket };
