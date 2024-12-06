// const path = require('path');
// const fs = require('fs');
// const PDFDocument = require('pdfkit');

// /**
//  * Generate a movie ticket PDF by overlaying dynamic data
//  * @param {Object} data - The dynamic data to overlay on the ticket.
//  * @param {Object} res - The HTTP response object.
//  */
// function generateTicket(data, res) {
//     try {
//         // Template image dimensions (1500x750 pixels)
//         const imageWidthPt = 1500; // Width in points
//         const imageHeightPt = 750; // Height in points (matches the 2:1 aspect ratio)

//         const doc = new PDFDocument({
//             size: [imageWidthPt, imageHeightPt], // Set PDF size to match template size
//             layout: 'landscape', // Landscape layout to match the 2:1 aspect ratio
//         });

//         // Set the response header for PDF
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'inline; filename="movie_ticket.pdf"');

//         // Stream the PDF to the response
//         doc.pipe(res);

//         // Load the template image
//         const templatePath = path.resolve(__dirname, '../templates/date.png');
//         if (fs.existsSync(templatePath)) {
//             // Position the image as the background
//             doc.image(templatePath, 0, 0, { width: imageWidthPt, height: imageHeightPt });
//         } else {
//             console.warn('Template not found:', templatePath);
//         }

//         // Overlay dynamic data on the image
//         doc.font('Helvetica-Bold').fillColor('white'); // Set font and color

//         // Adjust text positions based on the 1500x750 image
//         doc.fontSize(40).text(`${data.movie || 'N/A'}`, 100, 50, { width: 1300, align: 'center' }); // Movie title

//         doc.fontSize(20);
//         doc.text(`Date & Time: ${data.date || 'N/A'} at ${data.time || 'N/A'}`, 50, 650); // Date and time
//         doc.text(`Theater: ${data.theater || 'N/A'}`, 50, 700); // Theater details

//         doc.text(`Tickets: ${data.tickets || 'N/A'}`, 800, 650); // Tickets
//         doc.text(`Amount: $${data.amount || 'N/A'}`, 800, 700); // Amount

//         // Finalize the PDF
//         doc.end();

//     } catch (error) {
//         console.error('Error generating ticket:', error);
//         res.status(500).send('Error generating ticket');
//     }
// }

// module.exports = { generateTicket };
