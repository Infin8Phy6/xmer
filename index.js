// Endpoint to handle verification
app.post('/api/verify', async (req, res) => {
  const { data } = req.body; // Extract the verification data from the request body
  
  // Log the received data
  console.log('Received verification data:', data);

  // Google Apps Script Web App URL (replace with the actual URL from the Apps Script deployment)
  const googleAppScriptUrl = 'https://script.google.com/macros/s/AKfycbxx4RpFe7HvjllE-2Q6sWbtvg4qePqLKSHth4NlfKuuFxFSLqOtOoEJZiCN41uz0uQh/exec';

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
