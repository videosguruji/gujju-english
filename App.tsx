import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TutorSession from './components/TutorSession';
import LessonIntro from './components/LessonIntro';
import { Lesson } from './types';

const App: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsSessionActive(false); // Open Intro first
  };

  const startSession = () => {
    setIsSessionActive(true);
  };

  const closeLesson = () => {
    setSelectedLesson(null);
    setIsSessionActive(false);
  };

  return (
    <div className="antialiased text-gray-800 h-full">
      {isSessionActive && selectedLesson ? (
        <TutorSession 
            lesson={selectedLesson} 
            onClose={closeLesson} 
        />
      ) : (
        <>
            <Dashboard 
                onSelectLesson={handleLessonSelect} 
            />
            {selectedLesson && !isSessionActive && (
                <LessonIntro 
                    lesson={selectedLesson}
                    onStart={startSession}
                    onCancel={closeLesson}
                />
            )}
        </>
      )}
    </div>
  );
};

export default App;
