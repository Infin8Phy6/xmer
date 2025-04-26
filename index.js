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




 
// ✅ New Delete Hash Endpoint
app.post('/api/deleteHash', async (req, res) => {
  const { hash } = req.body;

  if (!hash) {
    return res.status(400).json({ error: 'Hash is required' });
  }

  console.log("Received hash to delete:", hash);
  try {
    const response = await axios.post('https://script.google.com/macros/s/AKfycbyko89cej6PqNyxAHQMpISqSfoPZ12cBrFSYyOL7bznGEXr9gyllSuqPZO03XlzA43_/exec', { hash });

    if (response.data.success) {
      res.json({ message: 'Welcome' });
    } else {
      res.status(404).json({ message: 'Hash not found' });
    }
  } catch (error) {
    console.error('Error deleting hash:', error);
    res.status(500).json({ error: 'Failed to delete hash' });
  }

});




// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

