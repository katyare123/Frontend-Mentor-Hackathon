<<<<<<< HEAD
# Frontend-Mentor-Hackathon
=======
﻿# Weather Now - Weather Application

A modern, responsive weather application built with HTML, CSS, and JavaScript that provides real-time weather information for any location worldwide.

## Features

- **Real-time Weather Data**: Get current weather conditions, hourly and daily forecasts
- **Location Search**: Search for any city worldwide using the geocoding API
- **Unit Conversion**: Switch between metric and imperial units
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, dark-themed interface with smooth animations
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: Visual feedback during data loading

## APIs Used

- **Geocoding API**: https://geocoding-api.open-meteo.com/v1/search
- **Weather API**: https://api.open-meteo.com/v1/forecast

## How to Use

1. **Open the Application**: Simply open index.html in your web browser
2. **Search for a Location**: Type a city name in the search bar and press Enter or click Search
3. **Select from Results**: Click on any search result to view weather for that location
4. **Change Units**: Click the "Units" button in the top-right to switch between metric and imperial units
5. **View Forecasts**: Scroll down to see daily and hourly weather forecasts

## File Structure

`
weather-app/
 index.html          # Main HTML file
 styles.css          # CSS styles and responsive design
 script.js           # JavaScript functionality
 assets/
    images/         # Weather icons and UI assets
    fonts/          # Custom fonts (Bricolage Grotesque, DM Sans)
 design/             # Design reference images
`

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features Implemented

###  Core Functionality
- Location search with autocomplete
- Real-time weather data display
- Current weather conditions
- 7-day daily forecast
- 8-hour hourly forecast
- Unit conversion (Celsius/Fahrenheit, km/h/mph, mm/inches)

###  UI/UX Features
- Responsive design for all screen sizes
- Dark theme with gradient backgrounds
- Smooth animations and transitions
- Loading states and error handling
- Accessible design with proper ARIA labels
- Focus states for keyboard navigation

###  Error Handling
- API error states with retry functionality
- No search results handling
- Network error recovery
- Graceful fallbacks

## Technical Details

- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Modern ES6+**: Uses classes, async/await, and modern JavaScript features
- **CSS Grid & Flexbox**: Modern layout techniques
- **Custom Properties**: CSS variables for consistent theming
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## Customization

The application uses CSS custom properties (variables) for easy theming:

`css
:root {
    --bg-primary: #100E1D;
    --bg-secondary: #1E213A;
    --accent-blue: #6047EC;
    --accent-orange: #FF820A;
    /* ... more variables */
}
`

## Performance

- Optimized API calls with debouncing
- Efficient DOM updates
- Minimal bundle size
- Fast loading times
- Smooth animations with CSS transforms

## Future Enhancements

- Weather alerts and notifications
- Historical weather data
- Weather maps integration
- Offline functionality with service workers
- PWA capabilities
- Multiple location favorites
- Weather widgets

## License

This project is open source and available under the MIT License.
>>>>>>> 563e19c (Done 1 stage)
