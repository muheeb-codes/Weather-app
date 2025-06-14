import React from 'react';
import { HourlyForecast as HourlyForecastType } from '../types/weather';
import WeatherIcon from './WeatherIcon';
import { formatTemperature } from '../utils/helpers';
import { format } from 'date-fns';
import { Droplets } from 'lucide-react';

interface HourlyForecastProps {
  data: HourlyForecastType[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, temperatureUnit }) => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-4 pb-4 min-w-full">
        {data.map((hour, index) => (
          <div
            key={hour.time}
            className="flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-lg p-3 min-w-[80px]"
          >
            <span className="text-sm text-white/80 mb-2">
              {index === 0 ? 'Now' : format(new Date(hour.time), 'HH:mm')}
            </span>
            <WeatherIcon
              weatherCode={hour.weatherCode}
              size={24}
              color="white"
              animated={index === 0}
            />
            <span className="font-semibold text-white mt-2">
              {formatTemperature(hour.temperature, temperatureUnit)}
            </span>
            {hour.precipitation > 0 && (
              <div className="flex items-center gap-1 mt-1 text-sm text-white/80">
                <Droplets size={14} />
                <span>{hour.precipitation}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;