import React from 'react';
import { Typography, Container } from '@mui/material';

const About = () => {
    return (
        <Container>
            <Typography variant="h4">About Fly or Not</Typography>
            <Typography variant="body1" style={{ marginTop: '20px' }}>
                Fly or Not is a weather dashboard designed to inform drone enthusiasts about the current 
                and forecasted weather conditions. This helps in deciding whether it's safe and suitable 
                to fly drones. The data is sourced from OpenWeatherMap and is updated regularly to ensure 
                accuracy and reliability.
            </Typography>
            {/* Add more content as needed */}
        </Container>
    );
};

export default About;
