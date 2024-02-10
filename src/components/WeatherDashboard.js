import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Card, Typography, CardContent } from '@mui/material';

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeatherData = async (latitude, longitude) => {
        const cacheKey = `weatherData-${latitude}-${longitude}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = 10; // Cache duration in minutes

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const age = (Date.now() - timestamp) / 60000; // Convert from ms to minutes
            if (age < cacheTime) {
                setWeatherData(data);
                setLoading(false);
                return; // Use cached data
            }
        }

        try {
            const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Use environment variable for API key
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            const dataToCache = {
                data: response.data,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            setWeatherData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isFlightSuitable = () => {
        if (!weatherData) return false;
        return weatherData.wind.speed < 10 && !weatherData.rain;
    };

    useEffect(() => {
        const success = position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
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

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
            ) : (
                <Card>
                    <CardContent>
                        <Typography variant="h5">Current Weather</Typography>
                        <Typography variant="body1">Temperature: {weatherData?.main?.temp}°C</Typography>
                        <Typography variant="body1">Wind Speed: {weatherData?.wind?.speed} m/s</Typography>
                        <Typography variant="body1">Humidity: {weatherData?.main?.humidity}%</Typography>
                        <Typography variant="body1">Description: {weatherData?.weather[0]?.description}</Typography>
                        <Typography variant="body1">Rain: {weatherData?.rain ? 'Yes' : 'No'}</Typography>
                        <Typography variant="body1">Cloudiness: {weatherData?.clouds?.all}%</Typography>
                        <Typography variant="body1">Pressure: {weatherData?.main?.pressure} hPa</Typography>
                        <Typography variant="body1">Visibility: {weatherData?.visibility / 1000} km</Typography>
                        <Typography variant="body1">Sunrise: {new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString()}</Typography>
                        <Typography variant="body1">Sunset: {new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString()}</Typography>
                        <Typography variant="body1">Location: {weatherData?.name}</Typography>
                        <Typography variant="body1">Coordinates: {weatherData?.coord?.lat}, {weatherData?.coord?.lon}</Typography>
                        <Typography variant="body1">Timezone: GMT {weatherData?.timezone / 3600}</Typography>
                        <Typography variant="body1">Weather Data Last Updated: {new Date(weatherData?.dt * 1000).toLocaleString()}</Typography>
                        <br />
                        <Typography variant="h6" style={{ color: isFlightSuitable() ? 'green' : 'red' }}>
                            {isFlightSuitable() ? 'Suitable for flying' : 'Not suitable for flying'}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default WeatherDashboard;
