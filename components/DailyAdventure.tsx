
import React, { useState, useEffect } from 'react';
import { DailyAdventureContent, StudentProfile } from '../types';
import { generateDailyAdventure } from '../services/contentService';
import { ChevronRight, Volume2, Star, CheckCircle, RotateCcw, Home, Sparkles } from 'lucide-react';

interface DailyAdventureProps {
  profile: StudentProfile;
  onComplete: (starsEarned: number) => void;
  onHome: () => void;
}

const DailyAdventure: React.FC<DailyAdventureProps> = ({ profile, onComplete, onHome }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<DailyAdventureContent | null>(null);
  const [step, setStep] = useState<'flashcards' | 'story' | 'quiz' | 'result'>('flashcards');
  
  // Sub-states
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const data = await generateDailyAdventure(profile.level);
      setContent(data);
      setLoading(false);
    };
    loadContent();
  }, [profile.level]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const handleNextCard = () => {
    if (!content) return;
    if (cardIndex < content.flashcards.length - 1) {
      setCardIndex(c => c + 1);
    } else {
      setStep('story');
    }
  };

  const handleStoryDone = () => {
    setStep('quiz');
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (!content) return;
    const isCorrect = optionIdx === content.quiz[quizIndex].correctIndex;
    if (isCorrect) setScore(s => s + 1);

    if (quizIndex < content.quiz.length - 1) {
        setQuizIndex(q => q + 1);
    } else {
        // Calculate final stars (Base 10 + 5 per correct answer)
        const totalStars = 10 + (isCorrect ? score + 1 : score) * 5;
        // Delay slightly to show visual feedback if needed, then result
        setTimeout(() => {
             setStep('result');
             onComplete(totalStars); // Update parent immediately but show UI here
        }, 500);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-indigo-600 flex flex-col items-center justify-center text-white z-50">
        <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold animate-pulse">Building your Daily Adventure...</h2>
        <p className="opacity-70 mt-2">AI is writing a story for {profile.name}...</p>
      </div>
    );
  }

  if (!content) return null;

  // --- RENDER: FLASHCARDS ---
  if (step === 'flashcards') {
    const card = content.flashcards[cardIndex];
    return (
      <div className="fixed inset-0 bg-yellow-400 z-50 flex flex-col p-6">
         <div className="flex justify-between items-center mb-6">
            <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-yellow-900">
                Word {cardIndex + 1}/{content.flashcards.length}
            </span>
            <button onClick={onHome} className="p-2 bg-black/10 rounded-full hover:bg-black/20"><Home size={20} className="text-yellow-900"/></button>
         </div>

         <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white w-full max-w-xs aspect-[3/4] rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden transform transition-all hover:scale-105">
                <div className="text-9xl mb-6 filter drop-shadow-md">{card.emoji}</div>
                <h2 className="text-4xl font-black text-gray-800 mb-2">{card.word}</h2>
                <p className="text-xl text-gray-500 font-bold mb-1">{card.pronunciation}</p>
                <p className="text-2xl text-yellow-600 font-medium">{card.gujarati}</p>
                
                <button 
                    onClick={() => speak(card.word)}
                    className="absolute bottom-6 right-6 p-4 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                >
                    <Volume2 size={24} />
                </button>
            </div>
         </div>

         <button 
            onClick={handleNextCard}
            className="w-full py-4 bg-white text-yellow-600 rounded-2xl font-bold text-xl shadow-lg mt-6 active:scale-95 transition-transform flex items-center justify-center gap-2"
         >
            {cardIndex === content.flashcards.length - 1 ? 'Start Story' : 'Next Word'} <ChevronRight />
         </button>
      </div>
    );
  }

  // --- RENDER: STORY ---
  if (step === 'story') {
    return (
        <div className="fixed inset-0 bg-purple-600 z-50 flex flex-col p-6 text-white overflow-hidden">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg opacity-80">Story Time</h3>
                <Volume2 size={24} className="opacity-50" />
             </div>
             
             <div className="flex-1 overflow-y-auto mb-6">
                <h1 className="text-3xl font-black mb-8 text-center drop-shadow-md">{content.story.title}</h1>
                <div className="space-y-6">
                    {content.story.content.map((sentence, idx) => (
                        <div key={idx} className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                            <p className="text-2xl font-bold mb-2">{sentence.english}</p>
                            <p className="text-lg opacity-70 font-medium">{sentence.gujarati}</p>
                            <button 
                                onClick={() => speak(sentence.english)}
                                className="mt-3 text-sm bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white/30 w-fit"
                            >
                                <Volume2 size={14} /> Listen
                            </button>
                        </div>
                    ))}
                </div>
             </div>

             <button 
                onClick={handleStoryDone}
                className="w-full py-4 bg-white text-purple-600 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
                Take Quiz <Sparkles size={20} />
            </button>
        </div>
    );
  }

  // --- RENDER: QUIZ ---
  if (step === 'quiz') {
    const q = content.quiz[quizIndex];
    return (
        <div className="fixed inset-0 bg-blue-500 z-50 flex flex-col p-6 text-white">
             <div className="w-full h-2 bg-black/20 rounded-full mb-8">
                <div 
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${((quizIndex) / content.quiz.length) * 100}%`}}
                ></div>
             </div>

             <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-center mb-10 leading-relaxed">{q.question}</h2>
                <div className="grid gap-4">
                    {q.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            className="p-6 bg-white text-blue-900 rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-50 active:scale-95 transition-all text-left flex items-center justify-between group"
                        >
                            {opt}
                            <div className="w-6 h-6 rounded-full border-2 border-blue-100 group-hover:border-blue-500"></div>
                        </button>
                    ))}
                </div>
             </div>
        </div>
    );
  }

  // --- RENDER: RESULT ---
  if (step === 'result') {
      return (
          <div className="fixed inset-0 bg-green-500 z-50 flex flex-col items-center justify-center p-6 text-white text-center">
              <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full animate-pulse"></div>
                 <Star size={120} className="fill-yellow-400 text-yellow-500 drop-shadow-2xl relative z-10 rotate-12" />
              </div>
              
              <h1 className="text-4xl font-black mb-2">Awesome!</h1>
              <p className="text-xl opacity-90 mb-8">You finished today's adventure!</p>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-8 w-full max-w-xs">
                  <div className="flex justify-between items-center mb-2">
                      <span className="font-bold opacity-80">Quiz Score</span>
                      <span className="font-bold text-2xl">{score}/{content.quiz.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="font-bold opacity-80">Total Stars</span>
                      <span className="font-bold text-2xl flex items-center gap-1 text-yellow-300">
                          +{10 + (score * 5)} <Star size={20} fill="currentColor" />
                      </span>
                  </div>
              </div>

              <button 
                onClick={onHome}
                className="px-10 py-4 bg-white text-green-600 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-transform"
              >
                Go Home
              </button>
          </div>
      );
  }

  return null;
};

export default DailyAdventure;
