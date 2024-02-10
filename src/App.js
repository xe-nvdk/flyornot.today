import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WeatherDashboard from './components/WeatherDashboard';
import Forecast from './components/Forecast';
import About from './components/About';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Fly or Not
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/forecast">
                        Forecast
                    </Button>
                    <Button color="inherit" component={Link} to="/about">
                        About
                    </Button>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<WeatherDashboard />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
}

export default App;
