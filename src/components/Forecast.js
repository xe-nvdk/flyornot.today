import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Card, Typography, CardContent } from '@mui/material';

const Forecast = () => {
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecastData = async () => {
            try {
                // Replace with actual latitude and longitude
                const latitude = 40.7128;
                const longitude = -74.0060;
                const apiKey = '33ca21b8a04a12c8a281f160af6c55a8'; // Replace with your API key
                const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

                const response = await axios.get(url);
                setForecastData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchForecastData();
    }, []);

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
            ) : (
                <Card>
                    <CardContent>
                        <Typography variant="h5">Weather Forecast</Typography>
                        {/* Map through forecastData.list to display each forecast entry */}
                        {forecastData.list.map((entry, index) => (
                            <div key={index}>
                                <Typography variant="body2">{new Date(entry.dt * 1000).toLocaleString()}</Typography>
                                <Typography variant="body2">Temperature: {entry.main.temp}°C</Typography>
                                <Typography variant="body2">Wind Speed: {entry.wind.speed} m/s</Typography>
                                {/* Additional forecast details */}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Forecast;
