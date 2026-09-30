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
    'Singapore',
  ]

  const getWeather = async (searchCity = city) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name.')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      // STEP 1: Find city coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchCity
        )}&count=1&language=en&format=json`
      )

      if (!geoResponse.ok) {
        throw new Error('Unable to find the city.')
      }

      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Please enter a valid city.')
      }

      const place = geoData.results[0]

      const latitude = place.latitude
      const longitude = place.longitude

      setLocationName(
        `${place.name}${place.country ? `, ${place.country}` : ''}`
      )

      // STEP 2: Get weather
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`
      )

      if (!weatherResponse.ok) {
        throw new Error('Unable to get weather information.')
      }

      const weatherData = await weatherResponse.json()

      setWeather(weatherData)
      setCity(place.name)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    getWeather()
  }

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky'
    if (code === 1) return 'Mainly clear'
    if (code === 2) return 'Partly cloudy'
    if (code === 3) return 'Overcast'
    if ([45, 48].includes(code)) return 'Foggy'
    if ([51, 53, 55].includes(code)) return 'Drizzle'
    if ([56, 57].includes(code)) return 'Freezing drizzle'
    if ([61, 63, 65].includes(code)) return 'Rain'
    if ([66, 67].includes(code)) return 'Freezing rain'
    if ([71, 73, 75].includes(code)) return 'Snow'
    if (code === 77) return 'Snow grains'
    if ([80, 81, 82].includes(code)) return 'Rain showers'
    if ([85, 86].includes(code)) return 'Snow showers'
    if ([95, 96, 99].includes(code)) return 'Thunderstorm'

    return 'Unknown weather'
  }

  const getWeatherIcon = (code, isDay = 1) => {
    if (!isDay) return '🌙'

    if (code === 0) return '☀️'
    if ([1, 2].includes(code)) return '🌤️'
    if (code === 3) return '☁️'
    if ([45, 48].includes(code)) return '🌫️'
    if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️'
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
    if ([95, 96, 99].includes(code)) return '⛈️'

    return '🌤️'
  }

  const getBackgroundImage = () => {
    if (!weather) return sunnyImg

    const code = weather.current.weather_code
    const isDay = weather.current.is_day

    if (!isDay) return nightImg

    if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
      return rainyImg
    }

    if ([2, 3, 45, 48].includes(code)) {
      return cloudyImg
    }

    return sunnyImg
  }

  const formatTime = (dateTime) => {
    if (!dateTime) return '--'

    const timePart = dateTime.split('T')[1]

    if (!timePart) return dateTime

    return timePart.substring(0, 5)
  }

  const getDayName = (dateString, index) => {
    if (index === 0) return 'Today'

    const date = new Date(`${dateString}T12:00:00`)

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
    })
  }

  const getSunProgress = () => {
    if (!weather) return 50

    const sunrise = new Date(weather.daily.sunrise[0])
    const sunset = new Date(weather.daily.sunset[0])
    const now = new Date()

    const total = sunset.getTime() - sunrise.getTime()
    const current = now.getTime() - sunrise.getTime()

    if (current <= 0) return 0
    if (current >= total) return 100

    return (current / total) * 100
  }

  return (
    <div
      className="app"
      style={{
        backgroundImage: `linear-gradient(
          rgba(0, 0, 0, 0.35),
          rgba(0, 0, 0, 0.45)
        ), url(${getBackgroundImage()})`,
      }}
    >
      <header className="header">
        <h1>🌦️ Weather Now</h1>
        <p>Real-time weather information for any city</p>
      </header>

      <main className="container">
        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />

          <button type="submit">
            🔍 Search
          </button>
        </form>

        <section className="popular-section">
          <h3>Popular Cities</h3>

          <div className="city-buttons">
            {popularCities.map((popularCity) => (
              <button
                key={popularCity}
                type="button"
                onClick={() => getWeather(popularCity)}
              >
                {popularCity}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="message">
            <h2>🌍 Loading weather...</h2>
            <p>Please wait a moment.</p>
          </div>
        )}

        {error && !loading && (
          <div className="message error">
            <h2>⚠️ {error}</h2>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="welcome">
            <h2>Welcome to Weather Now 🌤️</h2>
            <p>
              Search for any city to see current weather, sunrise,
              sunset and a 7-day forecast.
            </p>
          </div>
        )}

        {weather && !loading && (
          <>
            <section className="weather-card">
              <div className="location">
                <h2>📍 {locationName}</h2>
                <p>
                  {getWeatherDescription(weather.current.weather_code)}
                </p>
              </div>

              <div className="current-weather">
                <div className="weather-icon">
                  {getWeatherIcon(
                    weather.current.weather_code,
                    weather.current.is_day
                  )}
                </div>

                <div>
                  <div className="temperature">
                    {Math.round(weather.current.temperature_2m)}°C
                  </div>

                  <p>
                    Feels like{' '}
                    {Math.round(weather.current.apparent_temperature)}°C
                  </p>
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-card">
                  <span>💧</span>
                  <h3>Humidity</h3>
                  <strong>
                    {weather.current.relative_humidity_2m}%
                  </strong>
                </div>

                <div className="detail-card">
                  <span>💨</span>
                  <h3>Wind</h3>
                  <strong>
                    {Math.round(weather.current.wind_speed_10m)} km/h
                  </strong>
                </div>

                <div className="detail-card">
                  <span>🌧️</span>
                  <h3>Precipitation</h3>
                  <strong>
                    {weather.current.precipitation} mm
                  </strong>
                </div>
              </div>
            </section>

            <section className="sun-card">
              <h2>🌅 Sunrise & Sunset</h2>

              <div className="sun-times">
                <div>
                  <span>🌅 Sunrise</span>
                  <strong>
                    {formatTime(weather.daily.sunrise[0])}
                  </strong>
                </div>

                <div>
                  <span>🌇 Sunset</span>
                  <strong>
                    {formatTime(weather.daily.sunset[0])}
                  </strong>
                </div>
              </div>

              <div className="sun-slider">
                <div className="sun-line">
                  <div
                    className="sun-progress"
                    style={{
                      width: `${getSunProgress()}%`,
                    }}
                  ></div>

                  <div
                    className="sun-dot"
                    style={{
                      left: `${getSunProgress()}%`,
                    }}
                  >
                    ☀️
                  </div>
                </div>
              </div>

              <div className="sun-labels">
                <span>🌅 Sunrise</span>
                <span>🌇 Sunset</span>
              </div>
            </section>

            <section className="moon-card">
              <h2>🌙 Moon Information</h2>

              <div className="moon-content">
                <div className="moon-icon">🌙</div>

                <div>
                  <h3>Night Time</h3>
                  <p>
                    Sunset: {formatTime(weather.daily.sunset[0])}
                  </p>
                  <p>
                    Sunrise: {formatTime(weather.daily.sunrise[0])}
                  </p>
                </div>
              </div>
            </section>

            <section className="forecast-section">
              <h2>📅 7-Day Forecast</h2>

              <div className="forecast-grid">
                {weather.daily.time.map((date, index) => (
                  <div className="forecast-card" key={date}>
                    <h3>
                      {getDayName(date, index)}
                    </h3>

                    <div className="forecast-icon">
                      {getWeatherIcon(
                        weather.daily.weather_code[index],
                        1
                      )}
                    </div>

                    <p>
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

                    <p>
                      💨{' '}
                      {Math.round(
                        weather.daily.wind_speed_10m_max[index]
                      )}{' '}
                      km/h
                    </p>

                    <p>
                      🌧️{' '}
                      {weather.daily.precipitation_sum[index]} mm
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer>
        <p>Weather data powered by Open-Meteo 🌍</p>
      </footer>
    </div>
  )
}

export default App