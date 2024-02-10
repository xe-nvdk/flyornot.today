import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Card, Typography, CardContent, Grid, Paper, Box } from '@mui/material';

const Forecast = () => {
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cacheTimestamp, setCacheTimestamp] = useState(null);

    const fetchForecastData = async (latitude, longitude) => {
        const cacheKey = `forecastData-${latitude}-${longitude}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = 60 * 60 * 1000; // Cache duration in milliseconds (1 hour)

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const age = Date.now() - timestamp;
            if (age < cacheTime) {
                setForecastData(data);
                setCacheTimestamp(timestamp);
                setLoading(false);
                return; // Use cached data
            }
        }

        try {
            const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Use environment variable for API key
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            const response = await axios.get(url);
            const dataToCache = { data: response.data, timestamp: Date.now() };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            setForecastData(response.data);
            setCacheTimestamp(Date.now());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const success = position => {
            const { latitude, longitude } = position.coords;
            fetchForecastData(latitude, longitude);
        };

        const geolocationError = () => {
            setError("Unable to retrieve your location");
            setLoading(false);
        };

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
        } else {
            navigator.geolocation.getCurrentPosition(success, geolocationError);
        }
    }, []);

    const filterDailyForecast = (data) => {
        return data.list.filter((item) => new Date(item.dt * 1000).getHours() === 12);
    };

    const getDayName = (dateString) => {
        const date = new Date(dateString * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };


    const windspeedinkmh = (speed) => {
        return speed * 3.6;
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
            ) : (
                <>
                    <Paper elevation={3} style={{ padding: '15px', marginBottom: '20px' }}>
                        <Typography variant="h4" align="center">5-Day Forecast for {forecastData?.city?.name}</Typography>
                        <Typography variant="subtitle1" align="center">
                            Last Updated: {cacheTimestamp ? new Date(cacheTimestamp).toLocaleString() : 'Unknown'}
                        </Typography>
                    </Paper>
                    <Grid container spacing={2}>
                        {filterDailyForecast(forecastData).slice(0, 5).map((entry, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card raised>
                                    <CardContent>
                                        <Typography variant="h6">{getDayName(entry.dt)}</Typography>
                                        <Typography variant="body2">{new Date(entry.dt * 1000).toLocaleDateString()}</Typography>
                                        <Typography variant="body2">Temperature: {entry.main.temp}°C</Typography>
                                        <Typography variant="body2">Wind Speed: {windspeedinkmh(entry.wind.speed).toFixed(2)} km/h</Typography>
                                        {/* Additional forecast details */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default Forecast;
