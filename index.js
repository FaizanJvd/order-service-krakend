const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware for parsing JSON bodies
app.use(bodyParser.json());
const connectDB = require("./config/db");
connectDB();
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/orders', orderRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
