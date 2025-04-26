const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// ✅ Log Transaction Endpoint
app.post('/api/logTransaction', async (req, res) => {
  const { email, otp, txHash } = req.body;

  if (!email || !otp || !txHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Received transaction:', { email, otp, txHash });

  const googleAppsScriptUrl = "https://script.google.com/macros/s/YOUR_LOG_SCRIPT_ID/exec";

  try {
    const response = await axios.post(googleAppsScriptUrl, { email, otp, txHash });

    if (response.data.message === "Transaction logged successfully and email sent") {
      return res.status(200).json({ message: 'Please check your email for the transaction details.' });
    } else {
      return res.status(500).json({ error: 'Failed to log transaction in Google Sheets' });
    }
  } catch (error) {
    console.error('Error logging transaction:', error);
    return res.status(500).json({ error: 'Failed to log transaction' });
  }
});

// ✅ Verification Endpoint
app.post('/api/verify', async (req, res) => {
  const { data } = req.body;
  console.log("Received data:", data);

  try {
    const response = await axios.post('https://script.google.com/macros/s/YOUR_VERIFY_SCRIPT_ID/exec', { data });

    if (response.data.status === 'Verified') {
      res.json({ status: 'Verified' });
    } else {
      res.status(400).json({ status: 'Failed', message: 'Verification failed.' });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
});

// ✅ New Delete Hash Endpoint
app.post('/api/deleteHash', async (req, res) => {
  const { hash } = req.body;

  if (!hash) {
    return res.status(400).json({ error: 'Hash is required' });
  }

  console.log("Received hash to delete:", hash);


});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
