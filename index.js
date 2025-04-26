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

app.post('/api/logTransaction', async (req, res) => {
  const { email, otp, txHash } = req.body;

  if (!email || !otp || !txHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Received transaction:', { email, otp, txHash });

  // Google Apps Script Web App URL (Replace with your actual URL)
  const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbyRMg3aYPX5TAelqtEMLcrRi9wTI7tlphOA2sYV3zE5hUKCmk-JDD1Vl6Ns88RMuhyQ/exec";

  // Prepare payload to send to Google Apps Script
  const payload = {
    email,
    otp,
    txHash,
  };

  try {
    // Send the POST request to Google Apps Script using Axios
    const response = await axios.post(googleAppsScriptUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if Google Apps Script responds with success
    if (response.data.message === "Transaction logged successfully and email sent") {
      return res.status(200).json({ message: 'Please Check your Email for the details of the Transaction.' });
    } else {
      return res.status(500).json({ error: 'Failed to log transaction in Google Sheets' });
    }
  } catch (error) {
    console.error('Error logging transaction:', error);
    return res.status(500).json({ error: 'Failed to log transaction' });
  }
});


// can we add another api terminal here 
// Endpoint to handle verification
app.post('/api/verify', async (req, res) => {
  const { data } = req.body; // Extract the verification data from the request body
  
  // Log the received data
  console.log("Received data:", data);

  try {
    // Call Google Apps Script with the provided data
    const response = await axios.post('https://script.google.com/macros/s/AKfycbzuoo9GwybRL7aCaHbW32irikx9pYccoShhYtwu5Ss2xHAcxkPIEpSlEDQE62yxORhH/exec', {
      data: data // Send the data to Google Apps Script
    });

    // If Google Apps Script returns status "Verified"
    if (response.data.status === 'Verified') {
      res.json({ status: 'Verified' }); // Return verification success
    } else {
      res.status(400).json({ status: 'Failed', message: 'Verification failed.' });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
});

app.post('/api/deleteHash', async (req, res) => {
  const { hash } = req.body;

  // ✅ Log the received hash to the server console
  console.log("Received hash to delete:", hash);

  if (!hash) {
    return res.status(400).json({ error: 'Hash is required' });
  }

  // Respond with success — no forwarding to Google Apps Script if you just want logging
  return res.status(200).json({ success: true, message: 'Hash received and logged.' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

