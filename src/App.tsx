import React, { useState } from 'react';
import Search from './components/Search';
import WeatherIcon from './components/WeatherIcon';
import { LocationInfo, WeatherData, Units } from './types/weather';
import { fetchWeatherData } from './utils/api';
import { formatTemperature, formatWindSpeed, getTimeOfDay, getBackgroundGradient, formatTime } from './utils/helpers';
import { useGeolocation } from './hooks/useGeolocation';
import { saveRecentSearch, getUnitsPreference, saveUnits } from './utils/storage';
import { Wind, Droplets, Umbrella, Sun, Moon, MapPin, Clock, Thermometer, Sunrise, Sunset, AlertTriangle, Settings } from 'lucide-react';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [units, setUnits] = useState<Units>({
    temperature: getUnitsPreference() ? 'celsius' : 'fahrenheit',
    speed: getUnitsPreference() ? 'kmh' : 'mph'
  });
  const [showSettings, setShowSettings] = useState(false);
  const { coordinates, loading: geoLoading, error: geoError, getLocation } = useGeolocation();

  const handleLocationSelect = async (location: LocationInfo) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchWeatherData(location.coordinates, location);
      if (data) {
        setWeatherData(data);
        saveRecentSearch(location);
      } else {
        setError('Unable to fetch weather data. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while fetching weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocation = async () => {
    getLocation();
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleUnits = () => {
    const newIsMetric = units.temperature === 'fahrenheit';
    setUnits({
      temperature: newIsMetric ? 'celsius' : 'fahrenheit',
      speed: newIsMetric ? 'kmh' : 'mph'
    });
    saveUnits(newIsMetric);
  };

  // Watch for coordinates changes from geolocation
  React.useEffect(() => {
    if (coordinates && !geoError) {
      handleLocationSelect({
        name: 'Current Location',
        country: '',
        coordinates,
      });
    }
  }, [coordinates]);

  const timeOfDay = weatherData ? getTimeOfDay(weatherData.current.time) : 'day';
  const gradient = weatherData 
    ? getBackgroundGradient(weatherData.current.weatherCode, isDark ? 'night' : timeOfDay)
    : isDark ? 'from-gray-900 to-blue-900' : 'from-blue-400 to-blue-200';

  const getWeatherAlert = () => {
    if (!weatherData) return null;
    const { current } = weatherData;
    
    if (current.temperature > 35) {
      return { message: 'Extreme heat warning! Stay hydrated and avoid direct sunlight.', type: 'warning' };
    }
    if (current.weatherCode >= 95) {
      return { message: 'Severe thunderstorm warning! Seek shelter immediately.', type: 'danger' };
    }
    if ([71, 73, 75, 77, 85, 86].includes(current.weatherCode)) {
      return { message: 'Snow advisory! Drive carefully and stay warm.', type: 'info' };
    }
    return null;
  };

  const alert = getWeatherAlert();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            aria-label="Settings"
          >
            <Settings className="text-white" size={20} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="text-white\" size={20} /> : <Moon className="text-white" size={20} />}
          </button>
        </div>

        {showSettings && (
          <div className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg text-white">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Thermometer size={20} />
                Temperature Unit
              </span>
              <button
                onClick={toggleUnits}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {units.temperature === 'celsius' ? '°C' : '°F'}
              </button>
            </div>
          </div>
        )}

        <Search
          onLocationSelect={handleLocationSelect}
          onUseGeolocation={handleGeolocation}
          isLoading={isLoading || geoLoading}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 backdrop-blur-sm rounded-lg text-white text-center">
            {error}
          </div>
        )}

        {geoError && (
          <div className="mt-4 p-4 bg-red-500/10 backdrop-blur-sm rounded-lg text-white text-center">
            {geoError}
          </div>
        )}

        {alert && (
          <div className={`mt-4 p-4 ${
            alert.type === 'danger' ? 'bg-red-500/20' :
            alert.type === 'warning' ? 'bg-yellow-500/20' :
            'bg-blue-500/20'
          } backdrop-blur-sm rounded-lg text-white flex items-center gap-2`}>
            <AlertTriangle size={20} />
            <p>{alert.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="mt-8 text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
            <p className="mt-4">Fetching weather data...</p>
          </div>
        ) : weatherData ? (
          <div className="mt-8 space-y-6">
            {/* Location and current weather */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <MapPin className="inline-block" size={24} />
                  {weatherData.location.name}
                </h1>
                {weatherData.location.country && (
                  <p className="text-white/70">{weatherData.location.country}</p>
                )}
                <div className="mt-2 text-sm text-white/70 flex items-center justify-center gap-1">
                  <Clock size={16} />
                  {new Date(weatherData.current.time).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <WeatherIcon
                  weatherCode={weatherData.current.weatherCode}
                  size={64}
                  color="white"
                  animated
                />
                <div className="text-center">
                  <div className="text-6xl font-bold">
                    {formatTemperature(weatherData.current.temperature, units.temperature)}
                  </div>
                </div>
              </div>

              {/* Sunrise/Sunset */}
              {weatherData.daily[0].sunrise && weatherData.daily[0].sunset && (
                <div className="flex justify-center gap-8 mt-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Sunrise size={20} />
                    <span>{formatTime(weatherData.daily[0].sunrise)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sunset size={20} />
                    <span>{formatTime(weatherData.daily[0].sunset)}</span>
                  </div>
                </div>
              )}

              {/* Weather details */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Wind className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-white/70">Wind</p>
                  <p className="font-semibold">
                    {formatWindSpeed(weatherData.current.windSpeed, units.speed)}
                  </p>
                </div>
                <div className="text-center">
                  <Droplets className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-white/70">Humidity</p>
                  <p className="font-semibold">{weatherData.current.humidity}%</p>
                </div>
                <div className="text-center">
                  <Umbrella className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-white/70">Precipitation</p>
                  <p className="font-semibold">{weatherData.current.precipitation} mm</p>
                </div>
              </div>
            </div>

            {/* Daily forecast */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">7-Day Forecast</h2>
              <div className="space-y-4">
                {weatherData.daily.map((day, index) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between text-white"
                  >
                    <div className="w-24">
                      {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <WeatherIcon
                      weatherCode={day.weatherCode}
                      size={24}
                      color="white"
                    />
                    <div className="flex gap-4">
                      <span className="font-semibold">
                        {formatTemperature(day.temperatureMax, units.temperature)}
                      </span>
                      <span className="text-white/70">
                        {formatTemperature(day.temperatureMin, units.temperature)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-16 text-center text-white/80">
            <p className="text-lg">Enter a city name or use your current location to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;