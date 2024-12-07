const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "output" directory
app.use('/output', express.static(path.resolve(__dirname, 'output')));

// **GET endpoint to check server health**
app.get('/ticket', (req, res) => {
    res.send('Server is running!');
});

// **POST endpoint to generate the ticket**
app.post('/generate-ticket', (req, res) => {
    try {
        const { movieName, address, date, time, number, id } = req.body;

        // Path to save the PDF file
        const outputFilePath = path.resolve(__dirname, 'output', `movie_ticket_${Date.now()}.pdf`);

        // Ensure the output directory exists
        const outputDir = path.dirname(outputFilePath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Path to the template image
        const templatePath = path.resolve(__dirname, 'movie_ticket.png');

        // Debug: Log the resolved image path
        console.log('Template image path:', templatePath);

        // Create a PDF document
        const doc = new PDFDocument({
            size: [1500, 750], // Use the same dimensions as your image
        });

        // Pipe the PDF document to a file
        const writeStream = fs.createWriteStream(outputFilePath);
        doc.pipe(writeStream);

        // Add the template image as the background
        doc.image(templatePath, 0, 0, { width: 1500, height: 750 });

        // **Font Settings for Movie Name (Bold)**
        doc.font('Helvetica-Bold').fontSize(37).fillColor('black');
        doc.text(`${movieName || 'N/A'}`, 240, 90);

        // Add Address (Bold)
        doc.font('Helvetica-Bold').fontSize(26);
        const maxWidth = 1000; // Adjust the width as needed

        doc.text(`${address || 'N/A'}`, 125, 225, { width: maxWidth, align: 'left' });

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

        // Wait for the file to be written
        writeStream.on('finish', () => {
            const fileUrl = `${req.protocol}://${req.get('host')}/output/${path.basename(outputFilePath)}`;
            res.json({ success: true, message: 'Ticket generated', fileUrl });
        });
    } catch (error) {
        console.error('Error generating ticket:', error);
        res.status(500).send('Error generating ticket');
    }
});

// **Start the server**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
