
import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { UserPlus, User, Check, Sparkles } from 'lucide-react';

interface StudentProfileProps {
  onSelectProfile: (profile: StudentProfile) => void;
}

const AVATARS = ['🦁', '🐰', '🐼', '🦊', '🐸', '🦄', '🐯', '🐮'];

const StudentProfileView: React.FC<StudentProfileProps> = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('ge_profiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreating, setIsCreating] = useState(profiles.length === 0);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [level, setLevel] = useState<'nursery' | 'class1'>('nursery');

  const handleCreate = () => {
    if (!newName.trim()) return;

    const newProfile: StudentProfile = {
      id: Date.now().toString(),
      name: newName,
      avatar: selectedAvatar,
      level,
      stars: 0,
      streak: 0,
      lastVisit: new Date().toDateString(),
      completedLessons: []
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('ge_profiles', JSON.stringify(updated));
    onSelectProfile(newProfile);
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">New Student <br/> (નવો વિદ્યાર્થી)</h2>
          
          {/* Avatar Selection */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-500 mb-3 text-center">Choose an Avatar</p>
            <div className="flex flex-wrap justify-center gap-3">
              {AVATARS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-12 h-12 text-2xl rounded-full flex items-center justify-center transition-transform hover:scale-110 ${selectedAvatar === emoji ? 'bg-blue-100 border-2 border-blue-500 shadow-md' : 'bg-gray-50'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">Student Name (નામ)</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Aarav"
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-lg font-medium"
            />
          </div>

          {/* Level Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-500 mb-2">Class Level</label>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setLevel('nursery')}
                    className={`p-3 rounded-xl border-2 font-bold ${level === 'nursery' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}
                >
                    Nursery (KG)
                </button>
                <button 
                    onClick={() => setLevel('class1')}
                    className={`p-3 rounded-xl border-2 font-bold ${level === 'class1' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-100 text-gray-400'}`}
                >
                    Class 1
                </button>
            </div>
          </div>

          <button 
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} /> Let's Start!
          </button>
          
          {profiles.length > 0 && (
              <button onClick={() => setIsCreating(false)} className="w-full mt-4 text-gray-400 text-sm font-medium">Cancel</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-6">
       <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">G</div>
          <h1 className="text-3xl font-black text-gray-800">Who is learning?</h1>
          <p className="text-gray-500 font-medium">કોણ ભણી રહ્યું છે?</p>
       </div>

       <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center border border-transparent hover:border-blue-100"
            >
              <div className="text-5xl mb-4">{profile.avatar}</div>
              <h3 className="font-bold text-gray-800 text-lg">{profile.name}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                <Sparkles size={10} fill="currentColor" /> {profile.stars} Stars
              </div>
            </button>
          ))}

          <button
            onClick={() => setIsCreating(true)}
            className="bg-gray-100/50 p-6 rounded-[2rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-blue-300 transition-all text-gray-400 hover:text-blue-500"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                <UserPlus size={24} />
            </div>
            <span className="font-bold">Add Student</span>
          </button>
       </div>
    </div>
  );
};

export default StudentProfileView;
