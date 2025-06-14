import { WeatherCondition } from '../types/weather';

// Weather code mapping based on WMO codes
// https://open-meteo.com/en/docs
export const weatherConditions: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    label: 'Clear sky',
    icon: 'sun',
    color: 'from-blue-400 to-cyan-300',
  },
  1: {
    code: 1,
    label: 'Mainly clear',
    icon: 'sun',
    color: 'from-blue-400 to-cyan-300',
  },
  2: {
    code: 2,
    label: 'Partly cloudy',
    icon: 'cloud-sun',
    color: 'from-blue-400 to-gray-300',
  },
  3: {
    code: 3,
    label: 'Overcast',
    icon: 'cloud',
    color: 'from-gray-400 to-gray-300',
  },
  45: {
    code: 45,
    label: 'Fog',
    icon: 'cloud-fog',
    color: 'from-gray-400 to-gray-500',
  },
  48: {
    code: 48,
    label: 'Depositing rime fog',
    icon: 'cloud-fog',
    color: 'from-gray-400 to-gray-500',
  },
  51: {
    code: 51,
    label: 'Light drizzle',
    icon: 'cloud-drizzle',
    color: 'from-gray-400 to-blue-300',
  },
  53: {
    code: 53,
    label: 'Moderate drizzle',
    icon: 'cloud-drizzle',
    color: 'from-gray-400 to-blue-300',
  },
  55: {
    code: 55,
    label: 'Dense drizzle',
    icon: 'cloud-drizzle',
    color: 'from-gray-400 to-blue-300',
  },
  56: {
    code: 56,
    label: 'Light freezing drizzle',
    icon: 'cloud-drizzle',
    color: 'from-gray-400 to-blue-300',
  },
  57: {
    code: 57,
    label: 'Dense freezing drizzle',
    icon: 'cloud-drizzle',
    color: 'from-gray-400 to-blue-300',
  },
  61: {
    code: 61,
    label: 'Slight rain',
    icon: 'cloud-rain',
    color: 'from-gray-600 to-blue-400',
  },
  63: {
    code: 63,
    label: 'Moderate rain',
    icon: 'cloud-rain',
    color: 'from-gray-600 to-blue-400',
  },
  65: {
    code: 65,
    label: 'Heavy rain',
    icon: 'cloud-rain',
    color: 'from-gray-700 to-blue-500',
  },
  66: {
    code: 66,
    label: 'Light freezing rain',
    icon: 'cloud-snow',
    color: 'from-gray-600 to-blue-300',
  },
  67: {
    code: 67,
    label: 'Heavy freezing rain',
    icon: 'cloud-snow',
    color: 'from-gray-700 to-blue-400',
  },
  71: {
    code: 71,
    label: 'Slight snow fall',
    icon: 'cloud-snow',
    color: 'from-gray-400 to-blue-200',
  },
  73: {
    code: 73,
    label: 'Moderate snow fall',
    icon: 'cloud-snow',
    color: 'from-gray-500 to-blue-200',
  },
  75: {
    code: 75,
    label: 'Heavy snow fall',
    icon: 'cloud-snow',
    color: 'from-gray-600 to-blue-100',
  },
  77: {
    code: 77,
    label: 'Snow grains',
    icon: 'cloud-snow',
    color: 'from-gray-500 to-blue-200',
  },
  80: {
    code: 80,
    label: 'Slight rain showers',
    icon: 'cloud-drizzle',
    color: 'from-gray-600 to-blue-400',
  },
  81: {
    code: 81,
    label: 'Moderate rain showers',
    icon: 'cloud-rain',
    color: 'from-gray-600 to-blue-400',
  },
  82: {
    code: 82,
    label: 'Violent rain showers',
    icon: 'cloud-rain',
    color: 'from-gray-700 to-blue-500',
  },
  85: {
    code: 85,
    label: 'Slight snow showers',
    icon: 'cloud-snow',
    color: 'from-gray-500 to-blue-200',
  },
  86: {
    code: 86,
    label: 'Heavy snow showers',
    icon: 'cloud-snow',
    color: 'from-gray-600 to-blue-100',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    icon: 'cloud-lightning',
    color: 'from-gray-800 to-purple-400',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with slight hail',
    icon: 'cloud-lightning',
    color: 'from-gray-800 to-purple-400',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with heavy hail',
    icon: 'cloud-lightning',
    color: 'from-gray-900 to-purple-500',
  },
};

export const getWeatherCondition = (code: number): WeatherCondition => {
  return weatherConditions[code] || {
    code: -1,
    label: 'Unknown',
    icon: 'help-circle',
    color: 'from-gray-400 to-gray-300',
  };
};