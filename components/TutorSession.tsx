import React, { useEffect, useState, useRef } from 'react';
import { GeminiLiveService } from '../services/geminiLiveService';
import { Lesson, ConnectionState } from '../types';
import AudioVisualizer from './AudioVisualizer';
import { XCircle, RefreshCw } from 'lucide-react';

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
    <div className={`fixed inset-0 z-50 flex flex-col ${lesson.color} text-white`}>
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <div className="flex flex-col">
            <h2 className="text-3xl font-bold font-fredoka">{lesson.title}</h2>
            <span className="text-lg opacity-90 font-medium">{lesson.gujaratiTitle}</span>
        </div>
        <button 
            onClick={handleEndSession}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <XCircle size={40} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Connection Status */}
        {connectionState === ConnectionState.CONNECTING && (
            <div className="absolute top-10 animate-pulse text-xl font-bold bg-black/20 px-4 py-2 rounded-full">Connecting to Buddy...</div>
        )}
        
        {connectionState === ConnectionState.ERROR && (
            <div className="absolute top-10 bg-red-500/90 p-6 rounded-2xl text-white font-bold flex flex-col items-center shadow-lg backdrop-blur-md">
                <span className="mb-2 text-lg">Oops! Connection problem.</span>
                <button 
                    onClick={handleRetry}
                    className="bg-white text-red-500 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                    <RefreshCw size={18} /> Retry
                </button>
            </div>
        )}

        {/* Mascot / Avatar Placeholder */}
        <div className="relative mb-12">
            <div className={`w-64 h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm blob-animation`}>
                <span className="text-9xl filter drop-shadow-lg">{lesson.icon}</span>
            </div>
        </div>

        {/* Audio Interaction Area */}
        <div className="w-full max-w-md bg-white/10 rounded-3xl p-6 mx-4 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="text-center mb-4 text-xl font-semibold min-h-[1.75rem]">
                {connectionState === ConnectionState.CONNECTED 
                    ? "Buddy is listening..." 
                    : connectionState === ConnectionState.CONNECTING 
                        ? "Getting ready..." 
                        : "Paused"}
            </div>
            
            <div className="h-24 bg-black/20 rounded-2xl flex items-center justify-center overflow-hidden">
                 {connectionState === ConnectionState.CONNECTED ? (
                     <AudioVisualizer isActive={true} volume={volume} />
                 ) : (
                     <div className="text-white/50 flex items-center gap-2">
                         <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                         <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                         <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                     </div>
                 )}
            </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="p-8 pb-12 flex justify-center">
        <div className="text-sm opacity-70 font-medium tracking-wide">
            Speak clearly • શાંતિથી બોલો
        </div>
      </div>
    </div>
  );
};

export default TutorSession;