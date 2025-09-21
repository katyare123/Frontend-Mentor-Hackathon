// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.currentLocation = null;
        this.weatherData = null;
        this.units = {
            temperature: 'celsius',
            windSpeed: 'kmh',
            precipitation: 'mm'
        };
        this.isImperial = false;

        this.initializeElements();
        this.bindEvents();
        this.loadDefaultWeather();
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.results = document.getElementById('results');


    }

    initializeElements() {
        // Header elements
        this.unitsBtn = document.getElementById('unitsBtn');
        this.unitsMenu = document.getElementById('unitsMenu');
        this.switchToImperial = document.getElementById('switchToImperial');

        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchStatus = document.getElementById('searchStatus');
        this.searchResults = document.getElementById('searchResults');

        // Weather content elements
        this.weatherContent = document.getElementById('weatherContent');
        this.location = document.getElementById('location');
        this.date = document.getElementById('date');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.temperature = document.getElementById('temperature');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.wind = document.getElementById('wind');
        this.precipitation = document.getElementById('precipitation');
        this.dailyCards = document.getElementById('dailyCards');
        this.hourlyList = document.getElementById('hourlyList');
        this.selectedDay = document.getElementById('selectedDay');
        this.clearresults = document.getElementById('clear-results');
        // State elements
        this.errorState = document.getElementById('errorState');
        // this.loadingState = document.getElementById('loadingState');
        this.retryBtn = document.getElementById('retryBtn');
        this.loader = document.getElementById('loader');
        this.weatherContentdummy = document.getElementById('weatherContentdummy');
        this.searchcontainer = document.getElementById('search-section')
        this.chatBox = document.getElementById('chatBox');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.micBtn = document.getElementById('micBtn');
        this.ttsToggleBtn = document.getElementById('ttsToggleBtn');

    }

    bindEvents() {
        // Units dropdown
        this.unitsBtn.addEventListener('click', () => this.toggleUnitsMenu());
        this.switchToImperial.addEventListener('click', () => this.switchUnits());

        // Unit options
        document.querySelectorAll('.units-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectUnit(e.target.closest('.units-option')));
        });

        // Search functionality
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.searchInput.addEventListener('input', () => this.handleSearchInput());

        // Keyboard navigation for search results
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearchResults();
                this.searchInput.blur();
            }
        });
        this.clearresults.addEventListener('click', () => {
            this.clearSearchResults();
            this.searchInput.blur();
            this.searchInput.value = '';
            if (this.weatherContent.style.display = 'none') {
                this.weatherContent.style.display = 'flex';
            }
        })
        // Retry button
        this.retryBtn.addEventListener('click', () => this.retry());

        // Day selector
        this.dayBtn = document.getElementById('dayBtn');
        this.dayBtn.addEventListener('click', () => this.toggleDaySelector());

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.units-dropdown')) {
                this.closeUnitsMenu();
            }
            if (!e.target.closest('.day-selector')) {
                this.closeDaySelector();
            }
        });


        if (this.sendBtn) { this.sendBtn.addEventListener('click', () => this.handleChatSend()); }
        if (this.chatInput) { this.chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.handleChatSend(); }); }
        if (this.micBtn) { this.micBtn.addEventListener('click', () => this.toggleVoiceInput()); }
        if (this.ttsToggleBtn) { this.ttsToggleBtn.addEventListener('click', () => this.toggleTTS()); }
    }

    toggleUnitsMenu() {
        const isOpen = this.unitsMenu.classList.contains('show');

        if (isOpen) {
            // Fade out
            this.unitsMenu.classList.remove('fade-in', 'show');
            this.unitsMenu.classList.add('fade-out');
            this.unitsBtn.setAttribute('aria-expanded', 'false');

            // After transition, hide completely
            setTimeout(() => {
                this.unitsMenu.classList.remove('fade-out');
            }, 300); // match transition duration
        } else {
            // Fade in
            this.unitsMenu.classList.add('fade-in', 'show');
            this.unitsBtn.setAttribute('aria-expanded', 'true');
        }
    }

    closeUnitsMenu() {
        this.unitsMenu.classList.remove('fade-in', 'show');
        this.unitsMenu.classList.add('fade-out');
        this.unitsBtn.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            this.unitsMenu.classList.remove('fade-out');
        }, 300);
    }

    closeDaySelector() {
        if (this.daySelectorMenu) {
            this.daySelectorMenu.classList.remove('fade-in', 'show');
            this.daySelectorMenu.classList.add('fade-out');
            this.dayBtn.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                this.daySelectorMenu.classList.remove('fade-out');
            }, 300);
        }
    }

    toggleDaySelector() {
        if (!this.daySelectorMenu) {
            this.createDaySelectorMenu();
        }

        const isOpen = this.daySelectorMenu.classList.contains('show');

        if (isOpen) {
            this.daySelectorMenu.classList.remove('fade-in', 'show');
            this.daySelectorMenu.classList.add('fade-out');
            this.dayBtn.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                this.daySelectorMenu.classList.remove('fade-out');
            }, 300);
        } else {
            this.daySelectorMenu.classList.add('fade-in', 'show');
            this.dayBtn.setAttribute('aria-expanded', 'true');
        }
    }


    createDaySelectorMenu() {
        this.daySelectorMenu = document.createElement('div');
        this.daySelectorMenu.className = 'day-selector-menu';

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date().getDay(); // 0 = Sunday

        days.forEach((day, index) => {
            const dayOption = document.createElement('button');
            dayOption.className = 'day-option';
            dayOption.textContent = day;

            if (index === today) {
                dayOption.classList.add('active');
            }

            dayOption.addEventListener('click', () => {
                this.selectDay(day, index);
                this.daySelectorMenu.classList.remove('show');
                this.dayBtn.setAttribute('aria-expanded', 'false');
            });

            this.daySelectorMenu.appendChild(dayOption);
        });


        this.selectedDay.textContent = days[today];

        // Insert after the day selector button
        this.dayBtn.parentNode.insertBefore(this.daySelectorMenu, this.dayBtn.nextSibling);
    }


    selectDay(dayName, dayIndex) {
        this.selectedDay.textContent = dayName;

        // Update active state
        this.daySelectorMenu.querySelectorAll('.day-option').forEach(option => {
            option.classList.remove('active');
        });
        this.daySelectorMenu.querySelectorAll('.day-option')[dayIndex].classList.add('active');

        // Update hourly forecast for selected day
        if (this.weatherData) {
            this.updateHourlyForecastForDay(this.weatherData.hourly, dayIndex);
        }
    }

    updateHourlyForecastForDay(hourly, dayIndex) {
        const now = new Date();
        const selectedDate = new Date(now);
        selectedDate.setDate(now.getDate() + dayIndex);

        // Get hourly data for the selected day
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);

        const dayHours = [];
        const dayTemps = [];
        const dayWeatherCodes = [];

        hourly.time.forEach((time, index) => {
            const hourDate = new Date(time);
            if (hourDate >= dayStart && hourDate <= dayEnd) {
                dayHours.push(time);
                dayTemps.push(hourly.temperature_2m[index]);
                dayWeatherCodes.push(hourly.weather_code[index]);
            }
        });

        // Update hourly list with selected day data
        this.hourlyList.innerHTML = dayHours.slice(0, 10).map((time, index) => {
            const hour = new Date(time).getHours();
            const formattedTime = this.formatHour(hour);
            const temp = dayTemps[index];
            const weatherCode = dayWeatherCodes[index];

            return `
                <div class="hourly-item">
                    <div class="Flex">
                    <div class="hourly-time">${formattedTime}</div>
                    <img src="${this.getWeatherIcon(weatherCode)}" alt="${this.getWeatherDescription(weatherCode)}" class="hourly-icon">
                   </div>
                    <div class="hourly-temp">${this.formatTemperature(temp)}</div>
                </div>
            `;
        }).join('');
    }

    switchUnits() {
        this.isImperial = !this.isImperial;

        if (this.isImperial) {
            document.body.classList.remove('metric');
            document.body.classList.add('imperial');
            this.switchToImperial.textContent = 'Switch to Metric';
        } else {
            document.body.classList.add('metric');
            document.body.classList.remove('imperial');
            this.switchToImperial.textContent = 'Switch to Imperial';
        }

        // Update active states
        document.querySelectorAll('.units-option').forEach(option => {
            option.classList.remove('active');
        });

        document.querySelectorAll('.units-option').forEach(option => {
            const unit = option.dataset.unit;
            if ((this.isImperial && (unit === 'fahrenheit' || unit === 'mph' || unit === 'in')) ||
                (!this.isImperial && (unit === 'celsius' || unit === 'kmh' || unit === 'mm'))) {
                option.classList.add('active');
            }
        });

        // Refresh weather data with new units
        if (this.currentLocation) {
            this.loadWeatherData(this.currentLocation);
        }

        this.closeUnitsMenu();
    }

    selectUnit(option) {
        const unit = option.dataset.unit;

        // Remove active class from all options in the same section
        const section = option.closest('.units-section');
        section.querySelectorAll('.units-option').forEach(opt => opt.classList.remove('active'));

        // Add active class to selected option
        option.classList.add('active');

        // Update units object
        if (unit === 'celsius' || unit === 'fahrenheit') {
            this.units.temperature = unit;
        } else if (unit === 'kmh' || unit === 'mph') {
            this.units.windSpeed = unit;
        } else if (unit === 'mm' || unit === 'in') {
            this.units.precipitation = unit;
        }

        // Refresh weather data
        if (this.currentLocation) {
            this.loadWeatherData(this.currentLocation);
        }
    }

    async handleSearch() {

        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showSearchProgress();

        try {
            const results = await this.searchLocation(query);
            // If we have results, automatically pick the first one and clear the list
            if (results && results.length > 0) {
                const first = results[0];
                this.selectLocation({
                    latitude: first.latitude,
                    longitude: first.longitude,
                    name: first.name
                });
                this.clearSearchResults();
            } else {
                this.searchResults.innerHTML = '<div class="search-result-item">No search result found!</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError();
        }
    }

    async handleSearchInput() {
        const query = this.searchInput.value.trim();
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }

        // Debounce search to avoid too many API calls
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => {
            try {
                this.showSearchProgress();
                const results = await this.searchLocation(query);
                this.displaySearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                this.showSearchError();
            }
        }, 300);
    }

    async searchLocation(query) {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const data = await response.json();
        return data.results || [];
    }

    showSearchProgress() {
        this.searchStatus.textContent = 'Searching...';
        this.searchStatus.className = 'search-status search-in-progress';
    }

    displaySearchResults(results) {
        this.searchStatus.textContent = '';
        this.searchStatus.className = 'search-status active';

        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-result-item deactive">No search result found!</div>';
            this.weatherContent.style.display = 'none';
            return;
        } else {
            this.weatherContent.style.display = 'flex';

        }

        this.searchResults.innerHTML = results.map(result =>
            `<div class="search-result-item" data-lat="${result.latitude}" data-lon="${result.longitude}" data-name="${result.name}">
                ${result.name}, ${result.country}
            </div>`
        ).join('');

        // Add click handlers to results
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lon = parseFloat(item.dataset.lon);
                const name = item.dataset.name;
                this.selectLocation({ latitude: lat, longitude: lon, name: name });
                // Remove results after selection
                this.clearSearchResults();
            });
        });
    }

    clearSearchResults() {
        this.searchResults.innerHTML = '';
        this.searchStatus.textContent = '';
        this.searchStatus.className = 'search-status';
        // this.results.style.display='none';
    }

    showSearchError() {
        this.searchStatus.textContent = 'Search failed. Please try again.';
        this.searchStatus.className = 'search-status';
    }

    selectLocation(location) {
        this.currentLocation = location;
        this.searchInput.value = location.name;
        this.clearSearchResults();
        this.loadWeatherData(location);
    }

    async loadWeatherData(location) {
        this.showLoading();

        try {
            const weatherData = await this.fetchWeatherData(location);
            this.weatherData = weatherData;
            this.displayWeatherData(weatherData);
            this.hideLoading();
        } catch (error) {
            console.error('Weather data error:', error);
            this.showError();
        }
    }

    async fetchWeatherData(location) {
        const { latitude, longitude } = location;

        // Fetch current weather and forecast (+ wind direction, hourly precipitation)
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`);

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();
        console.log('Weather API response:', data);
        return {
            current: data.current,
            hourly: data.hourly,
            daily: data.daily,
            location: location
        };
    }

    displayWeatherData(data) {
        const { current, hourly, daily, location } = data;

        // Update location and date
        this.location.textContent = location.name;
        this.date.textContent = this.formatDate(new Date());

        // Update current weather
        this.temperature.textContent = this.formatTemperature(current.temperature_2m);
        this.feelsLike.textContent = this.formatTemperature(current.apparent_temperature);
        this.humidity.textContent = `${current.relative_humidity_2m}%`;
        this.wind.textContent = this.formatWindSpeed(current.wind_speed_10m);
        if (this.windNeedle && typeof current.wind_direction_10m === 'number') {
            this.windNeedle.style.transform = `rotate(${current.wind_direction_10m}deg)`;
            this.windDirText.textContent = `${Math.round(current.wind_direction_10m)}°`;
        }
        this.precipitation.textContent = this.formatPrecipitation(current.precipitation);

        // Update weather icon
        this.weatherIcon.src = this.getWeatherIcon(current.weather_code);
        this.weatherIcon.alt = this.getWeatherDescription(current.weather_code);

        // Update charts
        this.updateCharts(hourly);

        // Update daily forecast
        this.updateDailyForecast(daily);

        // Update hourly forecast
        this.updateHourlyForecast(hourly);
    }

    updateDailyForecast(daily) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();

        this.dailyCards.innerHTML = daily.time.slice(0, 7).map((date, index) => {
            const dayIndex = (today.getDay() + index) % 7;
            const weatherCode = daily.weather_code[index];
            const maxTemp = daily.temperature_2m_max[index];
            const minTemp = daily.temperature_2m_min[index];

            return `
                <div class="daily-card">
                    <div class="daily-day">${days[dayIndex]}</div>
                    <img src="${this.getWeatherIcon(weatherCode)}" alt="${this.getWeatherDescription(weatherCode)}" class="daily-icon">
                    <div class="daily-temps"><div>${this.formatTemperature(maxTemp)}</div>  <div>${this.formatTemperature(minTemp)}</div></div>
                </div>
            `;
        }).join('');
    }

    updateHourlyForecast(hourly) {
        const now = new Date();
        const currentHour = now.getHours();

        // Get next 8 hours
        const nextHours = hourly.time.slice(currentHour, currentHour + 8);
        const nextTemps = hourly.temperature_2m.slice(currentHour, currentHour + 8);
        const nextWeatherCodes = hourly.weather_code.slice(currentHour, currentHour + 8);

        this.hourlyList.innerHTML = nextHours.map((time, index) => {
            const hour = new Date(time).getHours();
            const formattedTime = this.formatHour(hour);
            const temp = nextTemps[index];
            const weatherCode = nextWeatherCodes[index];

            return `
                <div class="hourly-item">
                 <div class="Flex">
                 <img src="${this.getWeatherIcon(weatherCode)}" alt="${this.getWeatherDescription(weatherCode)}" class="hourly-icon">
                 <div class="hourly-time">${formattedTime}</div>
                   </div>  <div class="hourly-temp">${this.formatTemperature(temp)}</div>
                </div>
            `;
        }).join('');
    }

    updateCharts(hourly) {
        if (!window.Chart || !this.tempChartEl || !this.precipChartEl) return;
        const labels = hourly.time.slice(0, 24).map(t => new Date(t).getHours()).map(h => this.formatHour(h));
        const temps = hourly.temperature_2m.slice(0, 24).map(v => Math.round(v));
        const precip = (hourly.precipitation || []).slice(0, 24).map(v => Number(v?.toFixed ? v.toFixed(2) : v));

        if (this.tempChart) { this.tempChart.destroy(); }
        this.tempChart = new Chart(this.tempChartEl, {
            type: 'line',
            data: { labels, datasets: [{ label: 'Temp (°C)', data: temps, borderColor: '#4e79a7', backgroundColor: 'rgba(78,121,167,0.2)', tension: 0.35, fill: true, pointRadius: 2 }] },
            options: { responsive: true, scales: { y: { beginAtZero: false } }, plugins: { legend: { display: true } } }
        });

        if (this.precipChart) { this.precipChart.destroy(); }
        this.precipChart = new Chart(this.precipChartEl, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Precip (mm)', data: precip, backgroundColor: '#59a14f' }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: true } } }
        });
    }

    formatTemperature(temp) {
        if (this.units.temperature === 'fahrenheit') {
            return `${Math.round(temp * 9 / 5 + 32)}°`;
        }
        return `${Math.round(temp)}°`;
    }

    formatWindSpeed(speed) {
        if (this.units.windSpeed === 'mph') {
            return `${Math.round(speed * 0.621371)} mph`;
        }
        return `${Math.round(speed)} km/h`;
    }

    formatPrecipitation(precip) {
        if (this.units.precipitation === 'in') {
            return `${(precip * 0.0393701).toFixed(1)} in`;
        }
        return `${precip} mm`;
    }

    formatDate(date) {
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatHour(hour) {
        if (hour === 0) return '12 AM';
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return '12 PM';
        return `${hour - 12} PM`;
    }

    getWeatherIcon(code) {
        const iconMap = {
            0: 'assets/images/icon-sunny.webp',
            1: 'assets/images/icon-partly-cloudy.webp',
            2: 'assets/images/icon-partly-cloudy.webp',
            3: 'assets/images/icon-overcast.webp',
            45: 'assets/images/icon-fog.webp',
            48: 'assets/images/icon-fog.webp',
            51: 'assets/images/icon-drizzle.webp',
            53: 'assets/images/icon-drizzle.webp',
            55: 'assets/images/icon-drizzle.webp',
            61: 'assets/images/icon-rain.webp',
            63: 'assets/images/icon-rain.webp',
            65: 'assets/images/icon-rain.webp',
            71: 'assets/images/icon-snow.webp',
            73: 'assets/images/icon-snow.webp',
            75: 'assets/images/icon-snow.webp',
            77: 'assets/images/icon-snow.webp',
            80: 'assets/images/icon-drizzle.webp',
            81: 'assets/images/icon-drizzle.webp',
            82: 'assets/images/icon-drizzle.webp',
            85: 'assets/images/icon-snow.webp',
            86: 'assets/images/icon-snow.webp',
            95: 'assets/images/icon-storm.webp',
            96: 'assets/images/icon-storm.webp',
            99: 'assets/images/icon-storm.webp'
        };
        return iconMap[code] || 'assets/images/icon-sunny.webp';
    }

    getWeatherDescription(code) {
        const descriptionMap = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptionMap[code] || 'Clear sky';
    }

    showLoading() {
        this.weatherContent.style.display = 'none';
        this.errorState.style.display = 'none';
        // this.loadingState.style.display = 'flex';
        this.loader.style.display = 'flex';
        this.weatherContentdummy.style.display = 'flex';
    }

    hideLoading() {
        // this.loadingState.style.display = 'none';
        this.weatherContent.style.display = 'flex';
        this.loader.style.display = 'none';
        this.weatherContentdummy.style.display = 'none';
        if (document.getElementById('MainH2').style.display = 'none') {
            document.getElementById('MainH2').style.display = 'flex';
        } else {
            document.getElementById('MainH2').style.display = 'none';
        }

    }

    showError() {
        this.weatherContent.style.display = 'none';
        this.searchcontainer.style.display = 'none';
        // this.loadingState.style.display = 'none';
        this.errorState.style.display = 'flex';
        this.loader.style.display = 'none';
        this.weatherContentdummy.style.display = 'none';
        document.getElementById('MainH2').style.display = 'none';
    }

    retry() {
        if (this.currentLocation) {
            this.loadWeatherData(this.currentLocation);
            this.searchcontainer.style.display = 'flex';
        } else {
            this.loadDefaultWeather();
        }
    }

    async loadDefaultWeather() {
        this.searchInput.textContent = "Detecting location...";
        this.searchStatus.className = "search-status search-in-progress";
        this.currentLocation = 'Loading';
        this.loader.style.display = 'flex';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {
                    // LocationIQ reverse geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();

                    // LocationIQ puts the city/town in 'address'
                    const address = data.address || {};
                    let placeName = address.village || address.town || address.city || address.hamlet || "Current Location";
                    const locationName = `${placeName}, ${address.country || ""}`;

                    const userLocation = {
                        latitude,
                        longitude,
                        name: locationName
                    };

                    this.currentLocation = userLocation;
                    this.searchInput.value = userLocation.name;
                    this.clearSearchResults();
                    this.loadWeatherData(userLocation);

                } catch (err) {
                    console.error("Reverse geocoding failed:", err);
                    this.clearSearchResults();
                    this.fallbackToBerlin();
                }
            }, () => this.fallbackToBerlin());
        } else {
            this.fallbackToBerlin();
        }
    }

    fallbackToBerlin() {
        const defaultLocation = { latitude: 52.52, longitude: 13.405, name: "Berlin" };
        this.currentLocation = defaultLocation;
        this.searchInput.value = defaultLocation.name;
        this.loadWeatherData(defaultLocation);
    }



    toggleTheme() {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            this.themeToggle.classList = "theme-toggle bi bi-moon-fill";
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            this.themeToggle.classList = "theme-toggle bi bi-brightness-low";
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});



const text = "How's the sky looking today?";
const titleEl = document.getElementById("title");
let index = 0;

function type() {
    if (index < text.length) {
        titleEl.textContent += text[index];
        index++;
        setTimeout(type, 100); // typing speed
    }
}
type()
// Delay before typing starts (wait for fade up animation)
function makeunit() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    document.getElementById('selectedDay').textContent = days[today];
}
makeunit()




// --------------- AI Assistant ----------------
WeatherApp.prototype.toggleTTS = function () {
    const btn = this.ttsToggleBtn;
    const pressed = btn?.getAttribute('aria-pressed') === 'true';
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(!pressed));
};

WeatherApp.prototype.appendChat = function (role, text) {
    if (!this.chatBox) return;
    const line = document.createElement('div');
    line.className = `chat-line ${role}`;
    line.textContent = text;
    this.chatBox.appendChild(line);
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
};

WeatherApp.prototype.handleChatSend = async function () {
    const q = (this.chatInput?.value || '').trim();
    if (!q) return;

    // Append user message
    this.appendChat('user', q);
    this.chatInput.value = '';

    // Prepare weather context
    const c = this.weatherData?.current || {};
    const ctx = `CURRENT_OBS: temp=${c.temperature_2m ?? '-'}C, wind=${c.wind_speed_10m ?? '-'}m/s, precip=${c.precipitation ?? '-'}mm, code=${c.weather_code ?? '-'}`;

    // Get API key from Vite env
    const apiKey = '';
    if (!apiKey) {
        const msg = 'AI disabled: missing OpenRouter key (set VITE_OPENROUTER_KEY).';
        this.appendChat('assistant', msg);
        return;
    }

    const sys = 'You are a concise weather assistant. Answer using provided CURRENT_OBS context and general weather knowledge. Do not fabricate data or call external APIs yourself.';

    const payload = {
        model: 'deepseek/deepseek-chat-v3.1:free',
        messages: [
            { role: 'system', content: sys },
            { role: 'user', content: `${ctx}\n\n${q}` }
        ],
        stream: true
    };

    try {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': location.origin,
                'X-Title': 'Weather Now'
            },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) { throw new Error('AI request failed'); }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        let spokenOnce = false;
        this.appendChat('assistant', '');
        const last = this.chatBox.lastElementChild;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            chunk.split('\n').forEach(line => {
                const m = line.match(/^data: (.*)$/);
                if (!m) return;
                if (m[1] === '[DONE]') return;
                try {
                    const data = JSON.parse(m[1]);
                    const delta = data.choices?.[0]?.delta?.content || '';
                    if (delta) {
                        acc += delta;
                        last.textContent = acc;
                        if (this.ttsToggleBtn?.getAttribute('aria-pressed') === 'true' && !spokenOnce && acc.length > 120) {
                            speechSynthesis.cancel();
                            speechSynthesis.speak(new SpeechSynthesisUtterance(acc));
                            spokenOnce = true;
                        }
                    }
                } catch (e) { }
            });
        }
        if (this.ttsToggleBtn?.getAttribute('aria-pressed') === 'true' && !spokenOnce) {
            speechSynthesis.cancel();
            speechSynthesis.speak(new SpeechSynthesisUtterance(acc));
        }
    } catch (err) {
        this.appendChat('assistant', 'Sorry, I could not reach the AI service.');
    }
};

WeatherApp.prototype.toggleVoiceInput = function () {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
        const t = e.results[0][0].transcript;
        this.chatInput.value = t;
        this.handleChatSend();
    };
    rec.onerror = () => { };
    rec.start();
};
const Openbot = document.getElementById('Open-bot');
const asidechatbot = document.getElementById('aside-chatbot');
Openbot.addEventListener('click',()=>{
    asidechatbot.style.display='flex';
})