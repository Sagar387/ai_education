import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import StudyTools from './pages/StudyTools';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AIFlashcards from './pages/tools/AIFlashcards';
import VoiceNotes from './pages/tools/VoiceNotes';
import MindMaps from './pages/tools/MindMaps';
import PracticeTests from './pages/tools/PracticeTests';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools" element={<StudyTools />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/tools/flashcards" element={<AIFlashcards />} />
          <Route path="/tools/voice-notes" element={<VoiceNotes />} />
          <Route path="/tools/mind-maps" element={<MindMaps />} />
          <Route path="/tools/practice-tests" element={<PracticeTests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;