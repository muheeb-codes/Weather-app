import { Coordinates, CurrentWeather, DailyForecast, LocationInfo, WeatherData, HourlyForecast } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1';

export const geocodeCity = async (cityName: string): Promise<LocationInfo | null> => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1&language=en&format=json`
    );
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    const result = data.results[0];
    return {
      name: result.name,
      country: result.country,
      coordinates: {
        latitude: result.latitude,
        longitude: result.longitude,
      },
    };
  } catch (error) {
    console.error('Error geocoding city:', error);
    return null;
  }
};

export const fetchWeatherData = async (coordinates: Coordinates, locationInfo: LocationInfo): Promise<WeatherData | null> => {
  try {
    const { latitude, longitude } = coordinates;
    const url = `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,precipitation,apparent_temperature,uv_index&hourly=temperature_2m,weathercode,precipitation_probability,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max&timezone=auto`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data || data.error) {
      console.error('Error in weather data:', data.reason || 'Unknown error');
      return null;
    }
    
    // Parse current weather
    const current: CurrentWeather = {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weathercode,
      windSpeed: data.current.windspeed_10m,
      humidity: data.current.relativehumidity_2m,
      precipitation: data.current.precipitation,
      time: data.current.time,
      feelsLike: data.current.apparent_temperature,
      uvIndex: data.current.uv_index
    };
    
    // Parse hourly forecast
    const hourly: HourlyForecast[] = data.hourly.time.map((time: string, index: number) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      weatherCode: data.hourly.weathercode[index],
      precipitation: data.hourly.precipitation_probability[index]
    })).slice(0, 24); // Get next 24 hours
    
    // Parse daily forecast
    const daily: DailyForecast[] = data.daily.time.map((time: string, index: number) => ({
      date: time,
      weatherCode: data.daily.weathercode[index],
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      sunrise: data.daily.sunrise[index],
      sunset: data.daily.sunset[index],
      precipitationProbability: data.daily.precipitation_probability_max[index],
      uvIndex: data.daily.uv_index_max[index]
    }));
    
    return {
      current,
      hourly,
      daily,
      location: locationInfo,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};