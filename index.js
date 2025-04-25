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
  const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbxjk2dh8X7JMMwLA2WD5mk3uL2zh_dl2f6WEHnIG3uRB7cCn6dL9PgNoI8E4ruFt3BV/exec";

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
    if (response.data.message === "Transaction logged successfully") {
      return res.status(200).json({ message: 'Transaction logged successfully in Google Sheets' });
    } else {
      return res.status(500).json({ error: 'Failed to log transaction in Google Sheets' });
    }
  } catch (error) {
    console.error('Error logging transaction:', error);
    return res.status(500).json({ error: 'Failed to log transaction' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
