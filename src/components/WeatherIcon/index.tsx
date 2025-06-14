import React from 'react';
import * as LucideIcons from 'lucide-react';
import { getWeatherCondition } from '../../utils/weatherCodeMapping';

interface WeatherIconProps {
  weatherCode: number;
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  size = 24,
  color,
  className = '',
  animated = false,
}) => {
  const condition = getWeatherCondition(weatherCode);
  const IconComponent = LucideIcons[condition.icon as keyof typeof LucideIcons] || LucideIcons.HelpCircle;

  return (
    <div className={`inline-flex ${animated ? 'weather-icon-animated' : ''} ${className}`}>
      <IconComponent
        size={size}
        color={color}
        className={`${animated ? getAnimationClass(condition.icon) : ''}`}
      />
    </div>
  );
};

// Helper function to get animation class based on icon type
const getAnimationClass = (iconName: string): string => {
  switch (iconName) {
    case 'sun':
      return 'animate-spin-slow';
    case 'cloud-rain':
    case 'cloud-drizzle':
      return 'animate-bounce-slow';
    case 'cloud-lightning':
      return 'animate-pulse';
    case 'cloud-snow':
      return 'animate-wiggle';
    default:
      return 'animate-float';
  }
};

export default WeatherIcon;