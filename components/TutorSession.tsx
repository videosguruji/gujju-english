import React, { useEffect, useState, useRef } from 'react';
import { GeminiLiveService } from '../services/geminiLiveService';
import { Lesson, ConnectionState } from '../types';
import AudioVisualizer from './AudioVisualizer';
import { XCircle, RefreshCw, Mic, Headphones } from 'lucide-react';

interface TutorSessionProps {
  lesson: Lesson;
  onClose: () => void;
}

const TutorSession: React.FC<TutorSessionProps> = ({ lesson, onClose }) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [volume, setVolume] = useState(0);
  const serviceRef = useRef<GeminiLiveService | null>(null);

  const startConnection = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("No API Key found");
      setConnectionState(ConnectionState.ERROR);
      return;
    }

    if (serviceRef.current) {
        serviceRef.current.disconnect();
    }

    const service = new GeminiLiveService({
      apiKey,
      systemInstruction: lesson.systemPrompt,
      onOpen: () => setConnectionState(ConnectionState.CONNECTED),
      onClose: () => {
          // If we are not in error state, set to disconnected
          setConnectionState(prev => prev === ConnectionState.ERROR ? prev : ConnectionState.DISCONNECTED);
      },
      onError: (e) => {
          console.error("Session Error:", e);
          setConnectionState(ConnectionState.ERROR);
      },
      onVolumeChange: (v) => setVolume(v * 5)
    });

    serviceRef.current = service;
    setConnectionState(ConnectionState.CONNECTING);
    service.connect();
  };

  useEffect(() => {
    startConnection();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect();
      }
    };
  }, [lesson]);

  const handleEndSession = async () => {
    if (serviceRef.current) {
      await serviceRef.current.disconnect();
    }
    onClose();
  };

  const handleRetry = () => {
    startConnection();
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${lesson.color} text-white transition-colors duration-500`}>
      {/* Header */}
      <div className="p-6 pt-8 flex justify-between items-center z-10">
        <div className="flex flex-col">
            <h2 className="text-3xl font-bold font-fredoka drop-shadow-md">{lesson.title}</h2>
            <span className="text-lg opacity-90 font-medium drop-shadow-sm">{lesson.gujaratiTitle}</span>
        </div>
        <button 
            onClick={handleEndSession}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all shadow-lg active:scale-95"
            aria-label="Close session"
        >
          <XCircle size={32} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-lg mx-auto">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

        {/* Connection Status */}
        {connectionState === ConnectionState.CONNECTING && (
            <div className="absolute top-4 z-20 animate-bounce bg-white/20 px-4 py-2 rounded-full backdrop-blur-md text-sm font-bold shadow-sm border border-white/10">
                Connecting...
            </div>
        )}
        
        {connectionState === ConnectionState.ERROR && (
            <div className="absolute top-20 z-50 w-[90%] bg-red-500 p-6 rounded-3xl text-white font-bold flex flex-col items-center shadow-2xl border-4 border-red-400">
                <span className="mb-4 text-xl text-center">Connection Failed</span>
                <p className="mb-4 text-sm font-normal text-center opacity-90">Please check your internet and try again.</p>
                <button 
                    onClick={handleRetry}
                    className="bg-white text-red-600 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-red-50 transition-colors font-bold shadow-md active:scale-95"
                >
                    <RefreshCw size={20} /> Retry Now
                </button>
            </div>
        )}

        {/* Mascot / Avatar Area */}
        <div className="relative mb-16 z-10 transform transition-all duration-500">
            <div className={`w-64 h-64 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/20 ${connectionState === ConnectionState.CONNECTED ? 'blob-animation' : ''}`}>
                <span className="text-9xl filter drop-shadow-xl transform transition-transform hover:scale-110 duration-300">
                  {lesson.icon}
                </span>
            </div>
            
            {/* Status Indicator Dot */}
            <div className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-white/20 shadow-lg ${
                connectionState === ConnectionState.CONNECTED ? 'bg-green-400 animate-pulse' : 
                connectionState === ConnectionState.CONNECTING ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
        </div>

        {/* Audio Interaction Area */}
        <div className="w-[90%] bg-white/10 rounded-3xl p-6 backdrop-blur-md border border-white/20 shadow-xl flex flex-col items-center gap-4">
            <div className="text-center text-xl font-bold min-h-[1.75rem] text-white drop-shadow-md">
                {connectionState === ConnectionState.CONNECTED 
                    ? "Speak now • બોલો" 
                    : connectionState === ConnectionState.CONNECTING 
                        ? "Starting..." 
                        : "Waiting..."}
            </div>
            
            <div className="w-full h-24 bg-black/20 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 relative">
                 {connectionState === ConnectionState.CONNECTED ? (
                     <AudioVisualizer isActive={true} volume={volume} />
                 ) : (
                     <div className="text-white/40 flex flex-col items-center gap-2">
                        <Mic size={24} className="opacity-50" />
                        <span className="text-xs">Microphone Ready</span>
                     </div>
                 )}
            </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="p-8 pb-10 flex justify-center z-10">
        <div className="flex items-center gap-2 text-sm opacity-80 font-medium bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            <Headphones size={16} />
            <span>Use headphones for best audio</span>
        </div>
      </div>
    </div>
  );
};

export default TutorSession;
