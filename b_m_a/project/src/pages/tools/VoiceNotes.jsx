import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Save, Trash2, Download, AudioWaveform as Waveform } from 'lucide-react';

const VoiceNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const mediaRecorderRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [chunks, setChunks] = useState([]);
  const timerRef = useRef();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <span className="text-red-600 font-medium">Browser doesn't support speech recognition.</span>
        </div>
      </div>
    );
  }

  const startRecording = async () => {
    try {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const localChunks = [];
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          localChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(localChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setChunks(localChunks);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveNote = () => {
    if (transcript.trim() !== "") {
      const newNote = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        text: transcript,
        audioUrl: audioUrl || '',
        duration: recordingDuration
      };
      
      setNotes(prev => [newNote, ...prev]);
      setShowSaveAnimation(true);
      
      // Reset states
      setTimeout(() => {
        resetTranscript();
        setAudioUrl(null);
        setChunks([]);
        setShowSaveAnimation(false);
      }, 500);
    }
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-purple-100 p-3 rounded-full">
          <Waveform className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Voice Notes</h1>
      </div>

      {/* Recording UI */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleRecording}
              className={`p-4 rounded-full transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              <Mic className="h-6 w-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                {isRecording ? 'Recording...' : 'Ready to record'}
              </span>
              {isRecording && (
                <span className="text-sm text-red-600">
                  {formatDuration(recordingDuration)}
                </span>
              )}
            </div>
          </div>

          {(isRecording || audioUrl) && (
            <button
              onClick={saveNote}
              className={`flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg
                transition-all duration-300 hover:bg-purple-700 ${
                showSaveAnimation ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
              }`}
            >
              <Save className="h-4 w-4" />
              Save Note
            </button>
          )}
        </div>

        {/* Live transcript */}
        {isRecording && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-gray-700 min-h-[3rem]">
              {transcript || "Listening..."}
            </p>
          </div>
        )}

        {/* Audio preview */}
        {audioUrl && !isRecording && (
          <div className="mt-6 flex items-center gap-4">
            <audio controls src={audioUrl} className="flex-1" />
            <a
              href={audioUrl}
              download="voice_note.webm"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        )}
      </div>

      {/* Saved notes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Notes</h2>
        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No saved notes yet. Start recording!</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">{note.timestamp}</span>
                    <span className="text-sm text-gray-400">({formatDuration(note.duration)})</span>
                  </div>
                  <p className="text-gray-900 mb-4">{note.text}</p>
                  {note.audioUrl && (
                    <audio controls src={note.audioUrl} className="w-full" />
                  )}
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoiceNotes;