// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
