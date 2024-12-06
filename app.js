const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const PDFDocument = require('pdfkit');
const path = require('path');

const app = express();
app.use(express.json());

// **GET endpoint to check server health**
app.get('/ticket', (req, res) => {
    res.send('Server is running!');
});

// **POST endpoint to generate the ticket**
app.post('/generate-ticket', async (req, res) => {
    try {
        const { movieName, address, date, time, number, id } = req.body;

        // Path to the template image
        const templatePath = path.resolve(__dirname, '../templates/date.png');
        const templateImage = await loadImage(templatePath);

        // Create a canvas with dimensions matching the template
        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

        // Draw the template image onto the canvas
        ctx.drawImage(templateImage, 0, 0);

        // **Font Settings for Movie Name (Bold)**
        ctx.font = 'bold 37px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';

        // Add Movie Name
        ctx.fillText(`${movieName || 'N/A'}`, 240, 115);

        // Add Address (Bold)
        ctx.font = 'bold 30px Arial';
        ctx.fillText(`${address || 'N/A'}`, 125, 250);

        // **Font Settings for Other Data (Regular)**
        ctx.font = '28px Arial'; // Regular font size and weight

        // Add Date
        ctx.fillText(`${date || 'N/A'}`, 235, 620);

        // Add Time
        ctx.fillText(`${time || 'N/A'}`, 510, 620);

        // Add Number of Tickets
        ctx.fillText(`${number || 'N/A'}`, 840, 620);

        // Add Booking ID
        ctx.fillText(`${id || 'N/A'}`, 1125, 620);

        // Convert the canvas to an image buffer
        const imageBuffer = canvas.toBuffer('image/png');

        // Create a PDF document
        const doc = new PDFDocument({ size: [canvas.width, canvas.height] });

        // Set the response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="movie_ticket.pdf"');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Embed the canvas image into the PDF
        doc.image(imageBuffer, 0, 0, { width: canvas.width, height: canvas.height });

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error generating ticket:', error);
        res.status(500).send('Error generating ticket');
    }
});

// **Start the server**
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
