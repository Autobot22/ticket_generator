const express = require('express');
const { generateTicket } = require('./ticket-generator');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// POST endpoint to generate the movie ticket
app.post('/generate-ticket', (req, res) => {
    const ticketData = req.body;  // Expecting the dynamic data to be sent in the request body

    // Ensure that all required fields are provided
    if (!ticketData.movie || !ticketData.date || !ticketData.time || !ticketData.theater || !ticketData.tickets || !ticketData.amount) {
        return res.status(400).send('Missing required fields');
    }

    generateTicket(ticketData, res);
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));