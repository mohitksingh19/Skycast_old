const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Weather API endpoint
const apiKey = "58a06b838add95f0278a43762325b0b3";  // Replace with your OpenWeatherMap API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Route to get weather data
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await axios.get(`${apiUrl}${city}&appid=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
