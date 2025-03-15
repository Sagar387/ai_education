import React, { useState } from 'react';
import { Mic, Save } from 'lucide-react';

const VoiceNotes = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const saveNote = () => {
    setNotes([...notes, "New voice note - " + new Date().toLocaleString()]);
    setIsRecording(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Mic className="h-8 w-8 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">Voice Notes</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full ${
              isRecording ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
            }`}
          >
            <Mic className="h-6 w-6" />
          </button>
          {isRecording && (
            <button
              onClick={saveNote}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Save className="h-4 w-4" />
              Save Note
            </button>
          )}
        </div>
        {isRecording && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Recording in progress...
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-600" />
              <span className="text-gray-900">{note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceNotes;