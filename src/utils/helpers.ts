import { TemperatureUnit, SpeedUnit } from '../types/weather';

// Format temperature with unit
export const formatTemperature = (temp: number, unit: TemperatureUnit = 'celsius'): string => {
  if (unit === 'fahrenheit') {
    // Convert to Fahrenheit
    temp = (temp * 9/5) + 32;
  }
  return `${Math.round(temp)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

// Format wind speed with unit
export const formatWindSpeed = (speed: number, unit: SpeedUnit = 'kmh'): string => {
  if (unit === 'mph') {
    // Convert to mph
    speed = speed * 0.621371;
  }
  return `${Math.round(speed)} ${unit === 'kmh' ? 'km/h' : 'mph'}`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format time for display
export const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

// Get time of day for background (morning, day, evening, night)
export const getTimeOfDay = (dateTimeString: string): 'morning' | 'day' | 'evening' | 'night' => {
  const hours = new Date(dateTimeString).getHours();
  
  if (hours >= 5 && hours < 10) return 'morning';
  if (hours >= 10 && hours < 17) return 'day';
  if (hours >= 17 && hours < 20) return 'evening';
  return 'night';
};

// Get gradient class based on weather code and time of day
export const getBackgroundGradient = (weatherCode: number, timeOfDay: string): string => {
  // Base gradients by time of day
  const timeGradients = {
    morning: 'from-blue-300 to-yellow-200',
    day: 'from-blue-400 to-blue-200',
    evening: 'from-orange-400 to-purple-500',
    night: 'from-blue-900 to-purple-900',
  };
  
  // Weather specific overrides
  if (weatherCode >= 95) {
    // Thunderstorm
    return 'from-gray-800 to-purple-700';
  } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    // Snow
    return 'from-gray-300 to-blue-100';
  } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    // Rain
    return 'from-gray-600 to-blue-400';
  } else if ([45, 48].includes(weatherCode)) {
    // Fog
    return 'from-gray-400 to-gray-300';
  }
  
  // Default to time of day
  return timeGradients[timeOfDay as keyof typeof timeGradients] || timeGradients.day;
};