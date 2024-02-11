import React from 'react';
import { Helmet } from 'react-helmet';
import { Typography, Box } from '@mui/material';

const About = () => {
    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Helmet>
                {/* Title */}
                <title>About - FlyOrNot</title>

                {/* Meta tags for SEO */}
                <meta name="description" content="Get weather and forecast information for outdoor activities. Created by Ignacio Van Droogenbroeck." />
                <meta name="keywords" content="weather, forecast, outdoor activities, drones, flying, Ignacio Van Droogenbroeck" />

                {/* Open Graph meta tags for social sharing */}
                <meta property="og:title" content="About - FlyOrNot" />
                <meta property="og:description" content="Get weather and forecast information for outdoor activities. Created by Ignacio Van Droogenbroeck." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://flyornot.today/about" />
                <meta property="og:image" content="https://flyornot.today/flyornot.webp" />
                <meta property="og:image:alt" content="FlyOrNot Logo" />
            </Helmet>
            <Typography variant="h4" gutterBottom>About</Typography>
            <Typography variant="body1" paragraph>
                This website provides weather and forecast information based on your current location.
                It is created by Ignacio Van Droogenbroeck and aims to help users make informed decisions about outdoor activities, including flying drones.
            </Typography>
            <Typography variant="body1" paragraph>
                The conditions to fly or not fly considered on this website include factors such as wind speed, precipitation, visibility, and temperature.
                Users are encouraged to check these weather conditions before engaging in outdoor activities, especially those involving drones or other aerial devices.
                Specifically, to determine if it's suitable for flying, the following criteria are taken into account:
            </Typography>
            <ul>
                <li>Wind speed must be less than 10 m/s.</li>
                <li>There should be no precipitation (rain or snow) within the last hour.</li>
                <li>Cloud coverage should be less than 75%.</li>
                <li>Visibility should be greater than 4000 meters.</li>
                <li>The weather condition should not be categorized as one of the following: Thunderstorm, Drizzle, Rain, Snow, Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, or Tornado.</li>
            </ul>
            <Typography variant="body1" paragraph>
                Contributions to this project are welcome! If you'd like to contribute, please visit the GitHub repository:
            </Typography>
            <Typography variant="body1">
                <a href="https://github.com/xe-nvdk/flyornot.today" target="_blank" rel="noopener noreferrer">https://github.com/xe-nvdk/flyornot.today</a>
            </Typography>
            <Typography variant="body1" paragraph>
                Thank you for using this website, and happy flying!
            </Typography>
            <Typography variant="body2" color="textSecondary">Author: Ignacio Van Droogenbroeck</Typography>
            <Typography variant="body2" color="textSecondary">Version: 1.0.0</Typography>
            <Typography variant="body2" color="textSecondary">Last updated: Feb 11, 2024</Typography>
            <Typography variant="body2" color="textSecondary">Powered by <a href='https://drone-analytics.io' target='_blank' rel='noopener noreferrer'>DroneAnalytics</a></Typography>
        </Box>
    );
};

export default About;
