import React from 'react';
import { Lesson } from '../types';
import { Play, X, BookOpen, Mic } from 'lucide-react';

interface LessonIntroProps {
  lesson: Lesson;
  onStart: () => void;
  onCancel: () => void;
}

const LessonIntro: React.FC<LessonIntroProps> = ({ lesson, onStart, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`${lesson.color} p-6 text-white relative`}>
            <button 
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
                <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md">
                    Day {lesson.day}
                </span>
            </div>
            <h2 className="text-3xl font-bold mb-1">{lesson.title}</h2>
            <p className="text-xl opacity-90 font-medium">{lesson.gujaratiTitle}</p>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto">
            {/* Learning Outcomes */}
            <div className="mb-6">
                <h3 className="text-gray-900 font-bold text-lg mb-3 flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-500" />
                    આજે આપણે શીખીશું (Today we learn)
                </h3>
                <ul className="space-y-2">
                    {lesson.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-xl text-gray-700">
                            <span className="bg-blue-200 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {idx + 1}
                            </span>
                            <span>{outcome}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Vocabulary Table */}
            <div>
                <h3 className="text-gray-900 font-bold text-lg mb-3 flex items-center gap-2">
                    <Mic size={20} className="text-purple-500" />
                    નવા શબ્દો (New Words)
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 pl-4">English</th>
                                <th className="p-3">Gujarati</th>
                                <th className="p-3 pr-4 text-right">Speak</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {lesson.vocabulary.map((word, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="p-3 pl-4 font-bold text-gray-800">{word.english}</td>
                                    <td className="p-3 text-gray-600">{word.gujarati}</td>
                                    <td className="p-3 pr-4 text-right text-xs text-gray-400 font-mono">
                                        {word.pronunciation}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-2 border-t border-gray-100 bg-gray-50/50">
            <button
                onClick={onStart}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-xl font-bold text-white shadow-lg transform transition active:scale-95 ${lesson.color} hover:brightness-110`}
            >
                <Play fill="currentColor" />
                Start Class (ક્લાસ શરૂ કરો)
            </button>
        </div>

      </div>
    </div>
  );
};

export default LessonIntro;
