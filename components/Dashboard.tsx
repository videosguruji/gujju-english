
import React, { useState, useEffect } from 'react';
import { LESSONS } from '../constants';
import { Lesson, StudentProfile } from '../types';
import { Lock, CheckCircle, Star, Calendar, Zap, Volume2, Trophy, UserCircle, PlayCircle } from 'lucide-react';

interface DashboardProps {
  student: StudentProfile;
  onSelectLesson: (lesson: Lesson) => void;
  onStartDaily: () => void;
  onChangeProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ student, onSelectLesson, onStartDaily, onChangeProfile }) => {
  const [currentWord, setCurrentWord] = useState({ english: 'Hello', gujarati: 'નમસ્તે', emoji: '👋' });

  // Update daily word occasionally (mock)
  useEffect(() => {
     // Could be dynamic in future
  }, []);

  return (
    <div className="min-h-screen pb-10 bg-[#f0f9ff]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-20 px-4 py-3 border-b border-blue-50 flex justify-between items-center">
        <button onClick={onChangeProfile} className="flex items-center gap-2 bg-blue-50 pl-1 pr-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-blue-100">
               {student.avatar}
           </div>
           <span className="font-bold text-blue-900 text-sm truncate max-w-[80px]">{student.name}</span>
        </button>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                <Zap size={14} className="fill-orange-500" />
                {student.streak}
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                <Star size={14} className="fill-yellow-500" />
                {student.stars}
            </div>
        </div>
      </nav>

      <div className="pt-20 px-5 mb-8">
        
        {/* Daily Adventure Card - PRIMARY ACTION */}
        <div className="mb-8">
            <h2 className="text-xl font-black text-gray-800 mb-4">Today's Task</h2>
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-[2rem] p-6 text-white shadow-xl shadow-pink-200 relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">10 Minutes</span>
                            <h3 className="text-3xl font-black leading-tight mb-2">Daily<br/>Adventure</h3>
                            <p className="text-pink-100 font-medium text-sm mb-6 max-w-[150px]">Flashcards, Story & Quiz powered by AI</p>
                        </div>
                        <div className="text-6xl animate-bounce delay-1000">🚀</div>
                    </div>
                    
                    <button 
                        onClick={onStartDaily}
                        className="w-full bg-white text-pink-600 py-3 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                    >
                        <PlayCircle size={24} fill="currentColor" className="text-pink-600" />
                        Start Now
                    </button>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
            </div>
        </div>

        {/* Learning Path (Tutor) */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-gray-800 text-lg">AI Tutor Lessons</h3>
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full capitalize">{student.level}</span>
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
                                : student.completedLessons.includes(lesson.id)
                                    ? 'bg-green-500 border-green-200 text-white' 
                                    : 'bg-white border-blue-100 text-blue-500'
                        }`}>
                            {lesson.locked ? (
                                <Lock size={20} />
                            ) : student.completedLessons.includes(lesson.id) ? (
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
