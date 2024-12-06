const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// **GET endpoint to check server health**
app.get('/ticket', (req, res) => {
    res.send('Server is running!');
});

// **POST endpoint to generate the ticket**
app.post('/generate-ticket', (req, res) => {
    try {
        const { movieName, address, date, time, number, id } = req.body;

        // Path to the template image
        const templatePath = path.resolve(__dirname,"movie_ticket.png");

        
        // Debug: Log the resolved image path
        console.log('Template image path:', templatePath);

        // Check if the image exists

        // Create a PDF document
        const doc = new PDFDocument({
            size: [1500, 750], // Use the same dimensions as your image
        });

        // Set the response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="movie_ticket.pdf"');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add the template image as the background
        doc.image(templatePath, 0, 0, { width: 1500, height: 750 });

        // **Font Settings for Movie Name (Bold)**
        doc.font('Helvetica-Bold').fontSize(37).fillColor('black');
        doc.text(`${movieName || 'N/A'}`, 240, 90);

        // Add Address (Bold)
        doc.font('Helvetica-Bold').fontSize(30);
        doc.text(`${address || 'N/A'}`, 125, 225);

        // **Font Settings for Other Data (Regular)**
        doc.font('Helvetica').fontSize(28); // Regular font size and weight

        // Add Date
        doc.text(`${date || 'N/A'}`, 235, 595);

        // Add Time
        doc.text(`${time || 'N/A'}`, 510, 595);

        // Add Number of Tickets
        doc.text(`${number || 'N/A'}`, 840, 595);

        // Add Booking ID
        doc.text(`${id || 'N/A'}`, 1125, 595);

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
