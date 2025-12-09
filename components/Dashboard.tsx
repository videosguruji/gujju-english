import React from 'react';
import { LESSONS } from '../constants';
import { Lesson } from '../types';
import { Lock, CheckCircle, Star, Calendar } from 'lucide-react';

interface DashboardProps {
  onSelectLesson: (lesson: Lesson) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectLesson }) => {
  return (
    <div className="min-h-screen pb-10 bg-[#f0f9ff]">
      {/* Header */}
      <header className="bg-white p-6 rounded-b-[2.5rem] shadow-sm mb-8 relative z-10">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-extrabold text-blue-600 mb-1">GujjuEnglish</h1>
                <p className="text-gray-500 text-sm font-medium">Spoken English for Kids</p>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold border-2 border-yellow-200 shadow-sm mb-2">
                    <Star size={16} className="mr-1 fill-yellow-500 text-yellow-500" />
                    <span>350 XP</span>
                </div>
            </div>
        </div>
        
        {/* Progress Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold flex items-center gap-2">
                    <Calendar size={18} className="text-blue-200" />
                    Daily Streak
                </span>
                <span className="text-2xl font-black">Day 1</span>
            </div>
            <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[20%] rounded-full"></div>
            </div>
            <p className="text-xs text-blue-100 mt-2">Keep going! You are doing great.</p>
        </div>
      </header>

      {/* Lesson Path */}
      <div className="max-w-md mx-auto px-5 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 px-2">Your Learning Path</h2>
        
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
                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        COMPLETED
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.color} text-white shadow-md`}>
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
