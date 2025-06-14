import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Sun } from 'lucide-react';

interface UVIndexProps {
  value: number;
}

const UVIndex: React.FC<UVIndexProps> = ({ value }) => {
  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-400' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-400' };
    return { level: 'Extreme', color: 'text-purple-400' };
  };

  const { level, color } = getUVLevel(value);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sun className="text-yellow-400" size={20} />
        <h3 className="text-white font-medium">UV Index</h3>
      </div>
      <div className={`text-2xl font-bold ${color} mb-1`}>
        {value.toFixed(1)}
      </div>
      <div className={`text-sm ${color}`}>{level}</div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5 mt-2"
        value={[value]}
        max={11}
        step={0.1}
        disabled
      >
        <Slider.Track className="bg-white/20 relative grow rounded-full h-1">
          <Slider.Range className={`absolute h-full rounded-full ${color.replace('text', 'bg')}`} />
        </Slider.Track>
        <Slider.Thumb
          className={`block w-4 h-4 ${color.replace('text', 'bg')} rounded-full focus:outline-none`}
        />
      </Slider.Root>
    </div>
  );
};

export default UVIndex;