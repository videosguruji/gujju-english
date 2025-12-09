import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  volume: number; // 0 to 1
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, volume }) => {
  // We use 3 bars for a simple, cute visualizer
  const bars = [1, 2, 3];

  return (
    <div className="flex items-center justify-center gap-2 h-16">
      {bars.map((i) => (
        <div
          key={i}
          className={`w-4 bg-white rounded-full transition-all duration-100 ease-in-out ${isActive ? 'opacity-100' : 'opacity-30'}`}
          style={{
            height: isActive ? `${Math.max(20, volume * 300 + (Math.random() * 20))}%` : '20%',
            backgroundColor: isActive ? '#fff' : '#ffffff80'
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
