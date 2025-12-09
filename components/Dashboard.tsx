import React from 'react';
import { LESSONS } from '../constants';
import { Lesson } from '../types';
import { Lock, CheckCircle, Star, Calendar, Zap, Lightbulb } from 'lucide-react';

interface DashboardProps {
  onSelectLesson: (lesson: Lesson) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectLesson }) => {
  return (
    <div className="min-h-screen pb-10 bg-[#f0f9ff]">
      {/* Header */}
      <header className="bg-white p-6 rounded-b-[2.5rem] shadow-sm mb-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-extrabold text-blue-600 mb-1">GujjuEnglish</h1>
                <p className="text-gray-500 text-sm font-medium">Spoken English for Kids</p>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold border-2 border-yellow-200 shadow-sm mb-2 animate-pulse">
                    <Star size={16} className="mr-1 fill-yellow-500 text-yellow-500" />
                    <span>350 XP</span>
                </div>
            </div>
        </div>
        
        {/* Progress Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold flex items-center gap-2">
                        <Calendar size={18} className="text-blue-200" />
                        Daily Streak
                    </span>
                    <span className="text-2xl font-black flex items-center gap-1">
                        1 <Zap size={20} className="fill-yellow-400 text-yellow-400" />
                    </span>
                </div>
                <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[20%] rounded-full"></div>
                </div>
                <p className="text-xs text-blue-100 mt-2 font-medium">Come back tomorrow to keep your fire!</p>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        </div>
      </header>

      {/* Engagement Section: Word of the Day */}
      <div className="px-5 mb-8">
        <div className="bg-orange-500 rounded-3xl p-5 text-white shadow-lg shadow-orange-200 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 opacity-90">
                    <Lightbulb size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-wide">Word of the Day</h3>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-3xl font-black mb-1">Happy</div>
                        <div className="text-lg font-medium opacity-90">ખુશ (Khush)</div>
                    </div>
                    <button className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform">
                        Say it!
                    </button>
                </div>
            </div>
             <div className="absolute bottom-0 right-0 text-9xl opacity-10 rotate-12 select-none">😊</div>
        </div>
      </div>

      {/* Lesson Path */}
      <div className="max-w-md mx-auto px-5 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 px-2 flex items-center gap-2">
            Your Journey
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Level 1</span>
        </h2>
        
        <div className="flex flex-col items-center space-y-4">
            {LESSONS.map((lesson, index) => (
            <div key={lesson.id} className="w-full">
                <button
                onClick={() => !lesson.locked && onSelectLesson(lesson)}
                disabled={lesson.locked}
                className={`
                    group relative w-full p-0 overflow-hidden rounded-3xl transition-all duration-200
                    ${lesson.locked 
                        ? 'opacity-70 grayscale-[0.5]' 
                        : 'shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    }
                `}
                >
                <div className={`h-full bg-white flex flex-row items-stretch`}>
                    {/* Left Color Strip */}
                    <div className={`${lesson.locked ? 'bg-gray-300' : lesson.color} w-3`}></div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4 flex items-center gap-4">
                        <div className={`
                            w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-sm
                            ${lesson.locked ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}
                        `}>
                            {lesson.icon}
                        </div>
                        
                        <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-xs font-bold uppercase tracking-wider ${lesson.locked ? 'text-gray-400' : 'text-blue-600'}`}>
                                    Day {lesson.day}
                                </span>
                                {lesson.day < 2 && (
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle size={10} /> DONE
                                    </span>
                                )}
                            </div>
                            <h3 className={`text-lg font-bold leading-tight ${lesson.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                                {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                {lesson.gujaratiTitle}
                            </p>
                        </div>

                        <div className="pl-2">
                            {lesson.locked ? (
                                <Lock className="text-gray-300" size={20} />
                            ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.color} text-white shadow-md animate-bounce`}>
                                    {lesson.day < 2 ? <CheckCircle size={20} /> : <span className="font-bold text-sm">GO</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                </button>
            </div>
            ))}
        </div>
      </div>
      
      <div className="h-10"></div>
    </div>
  );
};

export default Dashboard;
