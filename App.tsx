
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TutorSession from './components/TutorSession';
import LessonIntro from './components/LessonIntro';
import StudentProfileView from './components/StudentProfile';
import DailyAdventure from './components/DailyAdventure';
import { Lesson, StudentProfile } from './types';

const App: React.FC = () => {
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  
  // Navigation States
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isTutorActive, setIsTutorActive] = useState<boolean>(false);
  const [isDailyActive, setIsDailyActive] = useState<boolean>(false);

  // Load last used profile
  useEffect(() => {
    const savedProfiles = localStorage.getItem('ge_profiles');
    if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles);
        if (profiles.length > 0) {
            // Check for last logged in logic here if needed, for now just null to force selection if multiple
            // or default to first if we wanted.
            // Keeping null forces the selection screen which is good for shared devices.
        }
    }
  }, []);

  const updateStudentStats = (starsEarned: number, lessonId?: string) => {
    if (!currentStudent) return;

    const updatedStudent = { ...currentStudent };
    updatedStudent.stars += starsEarned;
    
    // Update streak if first time today
    const today = new Date().toDateString();
    if (updatedStudent.lastVisit !== today) {
        updatedStudent.streak += 1;
        updatedStudent.lastVisit = today;
    }

    if (lessonId && !updatedStudent.completedLessons.includes(lessonId)) {
        updatedStudent.completedLessons.push(lessonId);
    }

    // Save to local storage
    const allProfilesStr = localStorage.getItem('ge_profiles');
    let allProfiles: StudentProfile[] = allProfilesStr ? JSON.parse(allProfilesStr) : [];
    
    allProfiles = allProfiles.map(p => p.id === updatedStudent.id ? updatedStudent : p);
    
    localStorage.setItem('ge_profiles', JSON.stringify(allProfiles));
    setCurrentStudent(updatedStudent);
  };

  const handleProfileSelect = (profile: StudentProfile) => {
    setCurrentStudent(profile);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsTutorActive(false); 
  };

  const startTutorSession = () => {
    setIsTutorActive(true);
  };

  const closeLesson = () => {
    // Award a star just for attending a session for now
    if (isTutorActive) {
        updateStudentStats(5, selectedLesson?.id);
    }
    setSelectedLesson(null);
    setIsTutorActive(false);
  };

  const handleDailyComplete = (stars: number) => {
      updateStudentStats(stars);
      setIsDailyActive(false);
  };

  // --- RENDER LOGIC ---

  if (!currentStudent) {
      return <StudentProfileView onSelectProfile={handleProfileSelect} />;
  }

  if (isDailyActive) {
      return (
        <DailyAdventure 
            profile={currentStudent} 
            onComplete={handleDailyComplete}
            onHome={() => setIsDailyActive(false)}
        />
      );
  }

  if (isTutorActive && selectedLesson) {
      return (
        <TutorSession 
            lesson={selectedLesson} 
            onClose={closeLesson} 
        />
      );
  }

  return (
    <div className="antialiased text-gray-800 h-full">
        <Dashboard 
            student={currentStudent}
            onSelectLesson={handleLessonSelect} 
            onStartDaily={() => setIsDailyActive(true)}
            onChangeProfile={() => setCurrentStudent(null)}
        />
        
        {selectedLesson && !isTutorActive && (
            <LessonIntro 
                lesson={selectedLesson}
                onStart={startTutorSession}
                onCancel={() => setSelectedLesson(null)}
            />
        )}
    </div>
  );
};

export default App;
