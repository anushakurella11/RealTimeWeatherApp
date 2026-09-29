import { useState } from 'react'
import './App.css'

import sunnyImg from './assets/sunny.jpg'
import cloudyImg from './assets/cloudy.jpg'
import rainyImg from './assets/rainy.jpg'
import nightImg from './assets/night.jpg'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
const popularCities = [
  'Hyderabad',
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Visakhapatnam',
  'Vijayawada',
  'Warangal',
  'Nagpur',
  'Lucknow',
  'Bhopal',
  'Indore',
  'Patna',
  'Bhubaneswar',
  'Chandigarh',
  'London',
  'New York',
  'Paris',
  'Tokyo',
  'Dubai',
  'Singapore'
]

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }
    function App() {

  const sunrise = "06:02";
  const sunset = "18:15";

  const getSunProgress = () => {
    const now = new Date();

    const [sunriseHour, sunriseMinute] = sunrise.split(":").map(Number);
    const [sunsetHour, sunsetMinute] = sunset.split(":").map(Number);

    const sunriseTime = new Date();
    sunriseTime.setHours(sunriseHour, sunriseMinute, 0, 0);

    const sunsetTime = new Date();
    sunsetTime.setHours(sunsetHour, sunsetMinute, 0, 0);

    let progress =
      ((now - sunriseTime) / (sunsetTime - sunriseTime)) * 100;

    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;

    return progress;
  };

  const sunProgress = getSunProgress();

  return (
    <div className="sun-card">

  <h2>☀️ Sun Progress</h2>

  <div className="sun-times">

    <div>
      <span className="sun-symbol">🌅</span>
      <p>Sunrise</p>
      <strong>6:02 AM</strong>
    </div>

    <div className="current-time">
      <p>Day Progress</p>
      <strong>{Math.round(sunProgress)}%</strong>
    </div>

    <div>
      <span className="sun-symbol">🌇</span>
      <p>Sunset</p>
      <strong>6:15 PM</strong>
    </div>

  </div>

  <div className="sun-slider">

    <div
      className="sun-progress"
      style={{ width: `${sunProgress}%` }}
    ></div>

    <div
      className="sun-dot"
      style={{ left: `${sunProgress}%` }}
    >
      ☀️
    </div>

  </div>

</div>
  )

    setLoading(true)
    setError('')

    try {
      // Step 1: Find city coordinates
      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      )

      const locationData = await locationResponse.json()

      if (!locationData.results || locationData.results.length === 0) {
        throw new Error('City not found')
      }

      const location = locationData.results[0]

      // Step 2: Get weather information
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto`
      )

      const weatherData = await weatherResponse.json()

      setLocationName(
        `${location.name}, ${location.country || ''}`
      )

      setWeather(weatherData)
    } catch (err) {
      setError('Unable to get weather. Please check the city name.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear Sky'
    if ([1, 2, 3].includes(code)) return 'Partly Cloudy'
    if ([45, 48].includes(code)) return 'Foggy'
    if ([51, 53, 55].includes(code)) return 'Drizzle'
    if ([61, 63, 65].includes(code)) return 'Rain'
    if ([71, 73, 75].includes(code)) return 'Snow'
    if ([80, 81, 82].includes(code)) return 'Rain Showers'
    if ([95, 96, 99].includes(code)) return 'Thunderstorm'

    return 'Unknown'
  }

  const getWeatherIcon = (code, isDay = 1) => {
    if (code === 0) return isDay ? '☀️' : '🌙'
    if ([1, 2, 3].includes(code)) return '🌤️'
    if ([45, 48].includes(code)) return '🌫️'
    if ([51, 53, 55].includes(code)) return '🌦️'
    if ([61, 63, 65].includes(code)) return '🌧️'
    if ([71, 73, 75].includes(code)) return '❄️'
    if ([80, 81, 82].includes(code)) return '🌦️'
    if ([95, 96, 99].includes(code)) return '⛈️'

    return '🌤️'
  }

  const formatDay = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short'
    })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBannerClass = () => {
    if (!weather) return ''

    const code = weather.current.weather_code

    if (weather.current.is_day === 0) {
      return 'night-banner'
    }

    if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
      return 'rain-banner'
    }

    if ([45, 48].includes(code)) {
      return 'fog-banner'
    }

    if ([1, 2, 3].includes(code)) {
      return 'cloud-banner'
    }

    return 'sunny-banner'
  }

  return (
    <div className="app">

      <div className="weather-container">

        {/* Header */}
        <header>
          <h1>🌦️ Weather Now</h1>

          <p className="subtitle">
            Real-time weather information for any city
          </p>
        </header>

        {/* Search */}
        <div className="search-box">

          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchWeather()
              }
            }}
          />

          <button onClick={searchWeather}>
            🔍 Search
          </button>

        </div>
<div className="popular-cities">

  <h3>🌍 Popular Cities</h3>

  <div className="city-buttons">

    {popularCities.map((popularCity) => (
      <button
        key={popularCity}
        onClick={() => {
          setCity(popularCity)

          setTimeout(() => {
            searchWeather()
          }, 0)
        }}
      >
        {popularCity}
      </button>
    ))}

  </div>

</div>
        {/* Loading */}
        {loading && (
          <div className="message">
            <div className="loader"></div>
            <p>Getting latest weather...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}

        {/* Weather Information */}
        {weather && !loading && (

          <div>

            {/* Main Weather Banner */}
            <div className={`weather-banner ${getBannerClass()}`}>

              <div className="banner-left">

                <p className="location">
                  📍 {locationName}
                </p>

                <h2>
                  {weather.current.is_day === 1
                    ? 'Good Day!'
                    : 'Good Evening!'}
                </h2>

                <p className="date">
                  {formatDate(weather.current.time)}
                </p>

              </div>

              <div className="banner-right">

                <div className="weather-icon">
                  {getWeatherIcon(
                    weather.current.weather_code,
                    weather.current.is_day
                  )}
                </div>

                <div className="main-temperature">
                  {Math.round(weather.current.temperature_2m)}°C
                </div>

                <p>
                  {getWeatherDescription(
                    weather.current.weather_code
                  )}
                </p>

              </div>

            </div>

            {/* Current Weather */}
            <section className="section">

              <h2>Current Weather</h2>

              <div className="details-grid">

                <div className="detail-card">
                  <span>🌡️</span>
                  <p>Feels Like</p>
                  <strong>
                    {Math.round(
                      weather.current.apparent_temperature
                    )}°C
                  </strong>
                </div>

                <div className="detail-card">
                  <span>💧</span>
                  <p>Humidity</p>
                  <strong>
                    {weather.current.relative_humidity_2m}%
                  </strong>
                </div>

                <div className="detail-card">
                  <span>💨</span>
                  <p>Wind Speed</p>
                  <strong>
                    {weather.current.wind_speed_10m} km/h
                  </strong>
                </div>

                <div className="detail-card">
                  <span>🌧️</span>
                  <p>Precipitation</p>
                  <strong>
                    {weather.current.precipitation} mm
                  </strong>
                </div>

              </div>

            </section>

            {/* Sunrise Sunset */}
            <section className="section">

              <h2>☀️ Sun Information</h2>

              <div className="sun-grid">

                <div className="sun-card">
                  <span>🌅</span>
                  <div>
                    <p>Sunrise</p>
                    <strong>
                      {formatTime(weather.daily.sunrise[0])}
                    </strong>
                  </div>
                </div>

                <div className="sun-card">
                  <span>🌇</span>
                  <div>
                    <p>Sunset</p>
                    <strong>
                      {formatTime(weather.daily.sunset[0])}
                    </strong>
                  </div>
                </div>

              </div>

            </section>

            {/* 7 Day Forecast */}
            <section className="section">

              <h2>📅 7-Day Forecast</h2>

              <div className="forecast-grid">

                {weather.daily.time.map((day, index) => (

                  <div className="forecast-card" key={day}>

                    <h3>
                      {index === 0 ? 'Today' : formatDay(day)}
                    </h3>

                    <div className="forecast-icon">
                      {getWeatherIcon(
                        weather.daily.weather_code[index]
                      )}
                    </div>

                    <p className="forecast-condition">
                      {getWeatherDescription(
                        weather.daily.weather_code[index]
                      )}
                    </p>

                    <div className="forecast-temperature">

                      <strong>
                        {Math.round(
                          weather.daily.temperature_2m_max[index]
                        )}°
                      </strong>

                      <span>
                        {Math.round(
                          weather.daily.temperature_2m_min[index]
                        )}°
                      </span>

                    </div>

                    <p className="rain-chance">
                      💧 {weather.daily.precipitation_sum[index]} mm
                    </p>

                  </div>

                ))}

              </div>

            </section>

          </div>

        )}

        {/* Welcome Screen */}
        {!weather && !loading && !error && (

          <div className="welcome">

            <div className="welcome-icon">
              🌍
            </div>

            <h2>Check Weather Anywhere</h2>

            <p>
              Enter a city name to see current weather,
              weather details and a 7-day forecast.
            </p>

            <div className="features">

              <span>🌡️ Temperature</span>
              <span>💧 Humidity</span>
              <span>💨 Wind</span>
              <span>🌧️ Rain</span>
              <span>🌅 Sunrise</span>
              <span>📅 Forecast</span>

            </div>

          </div>

        )}

        {/* Footer */}
        <footer>
          <p>
            Weather data powered by Open-Meteo
          </p>
        </footer>

      </div>

    </div>
  )
}

export default App