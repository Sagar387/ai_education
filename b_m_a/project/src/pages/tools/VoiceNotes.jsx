import React, { useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Save } from 'lucide-react';

const VoiceNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  // For transcript from react-speech-recognition
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // For audio recording using MediaRecorder
  const mediaRecorderRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [chunks, setChunks] = useState([]);

  // Check if the browser supports speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // Start both speech recognition and audio recording
  const startRecording = async () => {
    try {
      // 1) Start speech recognition
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });

      // 2) Request permission for mic and start MediaRecorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const localChunks = [];
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          localChunks.push(event.data);
        }
      };

      // Once recording stops, convert chunks to a Blob and create an object URL
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(localChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setChunks(localChunks);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone: ", err);
    }
  };

  // Stop both speech recognition and audio recording
  const stopRecording = () => {
    // Stop speech recognition
    SpeechRecognition.stopListening();

    // Stop MediaRecorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Save the current transcript + audio to our notes list
  const saveNote = () => {
    if (transcript.trim() !== "") {
      setNotes([...notes, {
        timestamp: new Date().toLocaleString(),
        text: transcript,
        audioUrl: audioUrl
      }]);
      // Reset for next recording
      resetTranscript();
      setAudioUrl(null);
      setChunks([]);
    } else {
      alert("No transcript available to save.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Mic className="h-8 w-8 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">Voice Notes</h1>
      </div>

      {/* Recording UI */}
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

        {/* Show transcript while recording */}
        {isRecording && (
          <>
            <div className="mt-4 text-center text-sm text-gray-500">
              Recording in progress...
            </div>
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
              <p className="text-gray-700">{transcript || "Listening..."}</p>
            </div>
          </>
        )}
      </div>

      {/* Audio preview (before saving) */}
      {audioUrl && !isRecording && (
        <div className="mb-8">
          <audio controls src={audioUrl} />
          <a href={audioUrl} download="voice_note.webm" className="ml-4 text-blue-600 underline">
            Download Audio
          </a>
        </div>
      )}

      {/* Display saved notes with transcript + audio download */}
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-purple-600" />
                <span className="font-semibold">{note.timestamp}</span>
              </div>
              <span className="text-gray-900">{note.text}</span>
              {note.audioUrl && (
                <>
                  <audio controls src={note.audioUrl} />
                  <a
                    href={note.audioUrl}
                    download={`voice_note_${index}.webm`}
                    className="text-blue-600 underline"
                  >
                    Download Audio
                  </a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceNotes;
