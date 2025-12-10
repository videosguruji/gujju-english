import React, { useState, useEffect } from 'react';
import { LESSONS } from '../constants';
import { Lesson } from '../types';
import { Lock, CheckCircle, Star, Calendar, Zap, Volume2, Trophy } from 'lucide-react';

interface DashboardProps {
  onSelectLesson: (lesson: Lesson) => void;
}

// Define data outside component to avoid recreation
const DAILY_WORDS = [
  { english: 'Sunday', gujarati: 'રવિવાર (Ravivar)', emoji: '☀️' },
  { english: 'School', gujarati: 'શાળા (Shala)', emoji: '🏫' },
  { english: 'Friend', gujarati: 'મિત્ર (Mitra)', emoji: '🤝' },
  { english: 'Happy', gujarati: 'ખુશ (Khush)', emoji: '😊' },
  { english: 'Water', gujarati: 'પાણી (Pani)', emoji: '💧' },
  { english: 'Play', gujarati: 'રમવું (Ramvu)', emoji: '🏏' },
  { english: 'Family', gujarati: 'પરિવાર (Parivar)', emoji: '👨‍👩‍👧‍👦' },
];

const Dashboard: React.FC<DashboardProps> = ({ onSelectLesson }) => {
  const [currentWord, setCurrentWord] = useState(DAILY_WORDS[0]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    // Set daily word based on day of week
    const dayIndex = new Date().getDay();
    setCurrentWord(DAILY_WORDS[dayIndex]);

    // Load progress from local storage
    const savedStreak = localStorage.getItem('ge_streak');
    const savedLastVisit = localStorage.getItem('ge_last_visit');
    const savedXp = localStorage.getItem('ge_xp');
    
    if (savedXp) setXp(parseInt(savedXp));

    const today = new Date().toDateString();
    
    if (savedLastVisit === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 1);
    } else if (savedLastVisit === new Date(Date.now() - 86400000).toDateString()) {
      const newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1;
      setStreak(newStreak);
      localStorage.setItem('ge_streak', newStreak.toString());
      localStorage.setItem('ge_last_visit', today);
    } else {
      setStreak(1);
      localStorage.setItem('ge_streak', '1');
      localStorage.setItem('ge_last_visit', today);
    }
  }, []);

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.english);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-[#f0f9ff]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-20 px-4 py-3 border-b border-blue-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">G</div>
           <span className="font-bold text-blue-900 text-lg">GujjuEnglish</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                <Zap size={14} className="fill-orange-500" />
                {streak}
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                <Star size={14} className="fill-yellow-500" />
                {xp > 0 ? xp : 350}
            </div>
        </div>
      </nav>

      <div className="pt-20 px-5 mb-8">
        {/* Welcome Message */}
        <h1 className="text-2xl font-black text-gray-800 mb-1">Hello, Champion! 👋</h1>
        <p className="text-gray-500 font-medium text-sm mb-6">Ready to learn English today?</p>

        {/* Word of the Day Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden mb-8 transform transition-transform hover:scale-[1.02]">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Calendar size={14} />
                        <span className="text-xs font-bold uppercase tracking-wide">Daily Word</span>
                    </div>
                    <Trophy size={20} className="text-yellow-300" />
                </div>
                
                <div className="flex flex-col items-center text-center mb-4">
                     <span className="text-5xl mb-2 filter drop-shadow-lg">{currentWord.emoji}</span>
                     <h2 className="text-4xl font-black tracking-tight mb-1">{currentWord.english}</h2>
                     <p className="text-xl font-medium text-indigo-100">{currentWord.gujarati}</p>
                </div>

                <button 
                    onClick={speakWord}
                    className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Volume2 size={18} />
                    Listen & Repeat
                </button>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Learning Path */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-gray-800 text-lg">Your Path</h3>
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Level 1</span>
            </div>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-[2.25rem] top-8 bottom-8 w-1 bg-gray-200 rounded-full -z-10"></div>

                {LESSONS.map((lesson) => (
                    <button
                        key={lesson.id}
                        onClick={() => !lesson.locked && onSelectLesson(lesson)}
                        disabled={lesson.locked}
                        className={`w-full flex items-center gap-4 p-2 rounded-2xl transition-all duration-300 group ${lesson.locked ? 'opacity-60' : 'hover:bg-white hover:shadow-md'}`}
                    >
                        {/* Status Icon */}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-sm z-10 transition-transform group-hover:scale-110 flex-shrink-0 ${
                            lesson.locked 
                                ? 'bg-gray-100 border-gray-200 text-gray-400' 
                                : lesson.day < 2 
                                    ? 'bg-green-500 border-green-200 text-white' 
                                    : 'bg-white border-blue-100 text-blue-500'
                        }`}>
                            {lesson.locked ? (
                                <Lock size={20} />
                            ) : lesson.day < 2 ? (
                                <CheckCircle size={24} className="fill-white text-green-500" />
                            ) : (
                                <div className="text-2xl">{lesson.icon}</div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className={`flex-1 text-left bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden ${!lesson.locked && 'group-hover:border-blue-200 group-hover:shadow-md'}`}>
                             {/* Color Strip */}
                             <div className={`absolute left-0 top-0 bottom-0 w-1 ${lesson.locked ? 'bg-gray-300' : lesson.color}`}></div>
                             
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Day {lesson.day}</span>
                             <h4 className="font-bold text-gray-900 leading-tight mb-1">{lesson.title}</h4>
                             <p className="text-xs text-gray-500 font-medium">{lesson.gujaratiTitle}</p>
                             
                             {!lesson.locked && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                        <Zap size={14} className="fill-current" />
                                    </div>
                                </div>
                             )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
