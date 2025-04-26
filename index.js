const express = require("express");
const cors = require("cors");
const axios = require("axios");  // Importing Axios

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend connections
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON requests

// ✅ CORS Headers Middleware (For Cross-Origin Requests)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});




 
// Endpoint to handle verification
app.post('/api/verify', async (req, res) => {
  const { data } = req.body; // Extract the verification data from the request body
  
  // Log the received data
  console.log('Received verification data:', data);

  // Google Apps Script Web App URL (replace with the actual URL from the Apps Script deployment)
  const googleAppScriptUrl = 'https://script.google.com/macros/s/AKfycbwV5ZFZ1g7kd8I94n7t-7j-KrEWUD_nBM-jjr8nUVMQoPhI8MSTVz028teLhfFYijCP/exec';

  try {
    // Send a POST request to the Google Apps Script web app
    const response = await axios.post(googleAppScriptUrl, {
      data: data // Sending the data to be verified
    });

    // Log the response from Google Apps Script
    console.log('Received response from Google Apps Script:', response.data);

    // Send the response from Google Apps Script back to the client
    res.json(response.data); // This sends { status: "Verified" } or { status: "Not Verified" }
  } catch (error) {
    console.error('Error in verifying data:', error);
    res.status(500).json({ status: 'Error' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

