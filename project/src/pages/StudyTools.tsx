import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mic, Network as Network2, TestTube } from 'lucide-react';

const StudyTools = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Study Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/tools/flashcards"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 bg-blue-100 rounded-lg p-3 mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Flashcards</h3>
          <p className="text-sm text-gray-500">Generate smart flashcards from your notes</p>
        </Link>

        <Link
          to="/tools/voice-notes"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 bg-purple-100 rounded-lg p-3 mb-4">
            <Mic className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Notes</h3>
          <p className="text-sm text-gray-500">Convert speech to organized notes</p>
        </Link>

        <Link
          to="/tools/mind-maps"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 bg-green-100 rounded-lg p-3 mb-4">
            <Network2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Mind Maps</h3>
          <p className="text-sm text-gray-500">Visual learning aids for complex topics</p>
        </Link>

        <Link
          to="/tools/practice-tests"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-12 w-12 bg-red-100 rounded-lg p-3 mb-4">
            <TestTube className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Tests</h3>
          <p className="text-sm text-gray-500">AI-powered assessments</p>
        </Link>
      </div>
    </div>
  );
};

export default StudyTools;