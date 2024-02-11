import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Card, Typography, CardContent, Box, Grid } from '@mui/material';
import { Helmet } from 'react-helmet';

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cacheTimestamp, setCacheTimestamp] = useState(null);

    const fetchWeatherData = async (latitude, longitude) => {
        const cacheKey = `weatherData-${latitude}-${longitude}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = 10 * 60 * 1000; // Cache duration in milliseconds (10 minutes)

        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const age = Date.now() - timestamp;
            if (age < cacheTime) {
                setWeatherData(data);
                setCacheTimestamp(timestamp);
                setLoading(false);
                return; // Use cached data
            }
        }

        try {
            const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Use environment variable for API key
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            const dataToCache = { data: response.data, timestamp: Date.now() };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            setWeatherData(response.data);
            setCacheTimestamp(Date.now());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isFlightSuitable = () => {
        if (!weatherData) return false;
        const { wind, rain, snow, clouds, visibility, weather } = weatherData;
        return (
            wind.speed < 10 &&
            (!rain || rain['1h'] === 0) &&
            (!snow || snow['1h'] === 0) &&
            clouds.all < 75 &&
            visibility > 4000 &&

            // Additional conditions
            weather[0].main !== 'Thunderstorm' &&
            weather[0].main !== 'Drizzle' &&
            weather[0].main !== 'Rain' &&
            weather[0].main !== 'Snow' &&
            weather[0].main !== 'Mist' &&
            weather[0].main !== 'Smoke' &&
            weather[0].main !== 'Haze' &&
            weather[0].main !== 'Dust' &&
            weather[0].main !== 'Fog' &&
            weather[0].main !== 'Sand' &&
            weather[0].main !== 'Ash' &&
            weather[0].main !== 'Squall' &&
            weather[0].main !== 'Tornado'
        );
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

    const WeatherCard = ({ title, value, unit }) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card raised>
                <CardContent>
                    <Typography color="textSecondary">{title}</Typography>
                    <Typography variant="h6">{value} {unit}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    const windspeedinkmh = (speed) => {
        return speed * 3.6;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Helmet>
                {/* Title */}
                <title>Can you fly your drone today? - FlyOrNot</title>

                {/* Meta tags for SEO */}
                <meta name="description" content="Get real-time weather data for your location to make informed decisions about outdoor activities, including flying drones. Created by Ignacio Van Droogenbroeck." />
                <meta name="keywords" content="weather dashboard, real-time weather, outdoor activities, drones, flying, Ignacio Van Droogenbroeck" />

                {/* Open Graph meta tags for social sharing */}
                <meta property="og:title" content="Can you fly your drone today? - FlyOrNot" />
                <meta property="og:description" content="Get real-time weather data for your location to make informed decisions about outdoor activities, including flying drones. Created by Ignacio Van Droogenbroeck." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://flyornot.today" />
                <meta property="og:image" content="https://flyornot.today/flyornot.webp" />
                <meta property="og:image:alt" content="FlyOrNot Weather Dashboard" />
            </Helmet>
            <Grid container spacing={2} justifyContent="center">
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
                ) : (
                    <>
                        <Grid item xs={12}>
                            <Card raised sx={{ backgroundColor: isFlightSuitable() ? '#C8E6C9' : '#FFCDD2' }}>
                                <CardContent>
                                    <Typography variant="h4" align="center">
                                        {isFlightSuitable() ? 'Good to Fly!' : 'Not Suitable for Flying'}
                                    </Typography>
                                    {!isFlightSuitable() && (
                                        <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                                            Check weather conditions: wind speed, precipitation, visibility, and temperature.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        <WeatherCard title="Description" value={weatherData?.weather[0]?.description} />
                        <WeatherCard title="Temperature" value={weatherData?.main?.temp} unit="°C" />
                        <WeatherCard title="Feels Like" value={weatherData?.main?.feels_like} unit="°C" />
                        <WeatherCard title="Wind Speed" value={windspeedinkmh(weatherData?.wind?.speed).toFixed(2)} unit="km/h" />
                        <WeatherCard title="Wind Direction" value={weatherData?.wind?.deg} unit="°" />
                        <WeatherCard title="Wind Gust" value={windspeedinkmh(weatherData?.wind?.gust).toFixed(2)} unit="km/h" />
                        <WeatherCard title="Humidity" value={weatherData?.main?.humidity} unit="%" />
                        <WeatherCard title="Precipitation" value={weatherData?.rain?.['1h'] || 0} unit="mm" />
                        <WeatherCard title="Precipation Probability" value={weatherData?.hourly?.[0]?.pop * 100} unit="%" />
                        <WeatherCard title="Rain" value={weatherData?.rain ? 'Yes' : 'No'} />
                        <WeatherCard title="Snow" value={weatherData?.snow ? 'Yes' : 'No'} />
                        <WeatherCard title="Cloudiness" value={weatherData?.clouds?.all} unit="%" />
                        <WeatherCard title="Pressure" value={weatherData?.main?.pressure} unit="hPa" />
                        <WeatherCard title="Visibility" value={weatherData?.visibility / 1000} unit="km" />
                        <WeatherCard title="Sunrise" value={new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString()} />
                        <WeatherCard title="Sunset" value={new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString()} />
                        <WeatherCard title="City" value={weatherData?.name} />
                        <WeatherCard title="Coordinates" value={`${weatherData?.coord?.lat}, ${weatherData?.coord?.lon}`} />
                        <WeatherCard title="Timezone" value={`GMT ${weatherData?.timezone / 3600}`} />
                        <WeatherCard title="Last Updated" value={cacheTimestamp ? new Date(cacheTimestamp).toLocaleString() : 'Unknown'} />
                    </>
                )}
            </Grid>
        </Box>
    );
}

export default WeatherDashboard;
