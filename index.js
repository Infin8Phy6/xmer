// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// ✅ CORS Headers Middleware (For Cross-Origin Requests)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
// Endpoint to receive hash and check it in Google Sheets
app.post('/api/deleteHash', async (req, res) => {
  const { hash } = req.body;

  // Log the hash received from the client
  console.log("Received Hash:", hash); // This will log the hash to the server console

  // Check if the hash is provided
  if (!hash) {
    return res.status(400).json({ error: 'Hash is required' });
  }

  try {
    // Send the hash to Google Apps Script for verification
    const googleAppsScriptUrls = 'https://script.google.com/macros/s/AKfycbwRelmsrhE2uCqX6JqUq0OxrFQfUPYl84SNxvofXAFzOXlDPIgg839en7HxmSZIjphx/exec'; // Ensure this URL is correct

    const response = await axios.post(googleAppsScriptUrls, { hash });

    // If Google Apps Script response indicates the hash was verified
    if (response.data.message === 'Hash === Verified') {
      res.status(200).json({ message: 'Hash === Verified' });
    } else {
      res.status(400).json({ error: 'Hash not found or verification failed' });
    }
  } catch (error) {
    console.error('Error verifying hash:', error);
    res.status(500).json({ error: 'Failed to verify hash' });
  }
});
//ok 

// Endpoint
app.post('/api/logTransaction', async (req, res) => {
  const { email, otp, txHash } = req.body;

  if (!email || !otp || !txHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Received transaction:', { email, otp, txHash });

  // Google Apps Script URL (replace with yours if needed)
  const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbxxfioLUCNvWq1n9JNp2d7Udz7Twl-q3XlHIAdTDk38i9tNfSoyc3dpG48snNXQ5Ti_/exec";

  try {
    const response = await axios.post(googleAppsScriptUrl, { email, otp, txHash }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Google Apps Script Response:', response.data);

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
// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
