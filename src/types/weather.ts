export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  name: string;
  country: string;
  coordinates: Coordinates;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity?: number;
  precipitation?: number;
  time: string;
  feelsLike?: number;
  uvIndex?: number;
  airQuality?: {
    pm2_5: number;
    pm10: number;
    no2: number;
  };
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  sunrise?: string;
  sunset?: string;
  precipitationProbability?: number;
  uvIndex?: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: LocationInfo;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph';

export interface Units {
  temperature: TemperatureUnit;
  speed: SpeedUnit;
}

export interface WeatherCondition {
  code: number;
  label: string;
  icon: string;
  color: string;
}

export interface AirQualityLevel {
  level: 'good' | 'moderate' | 'poor' | 'very-poor';
  color: string;
  description: string;
}