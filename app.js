const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'Public')));

// Weather API endpoint
const apiKey = "58a06b838add95f0278a43762325b0b3";  // Replace with your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Route to get weather data
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        // Fetch weather data from the API
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        res.json(response.data); // Send weather data as response
    } catch (error) {
        res.status(500).send('Error fetching weather data.');
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on https://0.0.0.0:${port}`);
});
