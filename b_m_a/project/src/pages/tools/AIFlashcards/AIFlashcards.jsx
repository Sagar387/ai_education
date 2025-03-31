import React, { useState, useEffect } from 'react';
import { Brain, PlusCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useFlashcardData } from './hooks';

const AIFlashcards = () => {
  // State for flashcard display
  const [showUpload, setShowUpload] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [customTopics, setCustomTopics] = useState('');
  const [numCards, setNumCards] = useState(20);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Hooks for flashcard functionality
  const {
    flashcards,
    isLoading,
    error,
    savedFlashcards,
    isSaving,
    saveSuccess,
    flashcardsFetchedRef,
    fetchSavedFlashcards,
    generateFlashcards,
    saveFlashcards,
  } = useFlashcardData();

  // Fetch saved flashcards on component mount
  useEffect(() => {
    if (!flashcardsFetchedRef.current) {
      fetchSavedFlashcards();
    }
  }, [fetchSavedFlashcards, flashcardsFetchedRef]);

  // Create new flashcards
  const handleCreateFlashcards = () => {
    setShowUpload(true);
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedTopics([]);
    setCustomTopics('');
    setNumCards(20);
    flashcardsFetchedRef.current = false;
  };

  // File handling
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  // Navigation
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedFile) {
      setError('Please upload a PDF file first');
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerateFlashcards();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    setShowUpload(false);
    setCurrentStep(1);
    setSelectedFile(null);
    setError('');
    flashcardsFetchedRef.current = false;
    fetchSavedFlashcards();
  };

  // Flashcard generation
  const handleGenerateFlashcards = async () => {
    try {
      await generateFlashcards(selectedFile, numCards, selectedTopics, customTopics);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Flashcard navigation
  const nextCard = () => {
    if (currentCardIndex < flashcards.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // Save flashcards
  const handleSaveFlashcards = async () => {
    await saveFlashcards(flashcards, selectedFile, numCards, selectedTopics, customTopics);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Brain className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Flashcards</h1>
      </div>

      {!showUpload ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md mb-10 overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to AI Flashcards
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl">
                Create personalized flashcards based on your own content or choose
                from saved flashcards below.
              </p>
              <button
                onClick={handleCreateFlashcards}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md"
              >
                <PlusCircle className="h-5 w-5" />
                Create New Flashcards
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center ${
                  currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
                    currentStep >= 1
                      ? 'bg-gray-200 border-gray-400'
                      : 'border-gray-300'
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Resources</span>
              </div>
              <div
                className={`w-12 h-1 mx-2 ${
                  currentStep >= 2 ? 'bg-gray-400' : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`flex items-center ${
                  currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
                    currentStep >= 2
                      ? 'bg-gray-200 border-gray-400'
                      : 'border-gray-300'
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Customize</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload PDF */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upload your PDF
              </h2>
              <div className="mt-8">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <button
                    onClick={() => document.getElementById('pdf-upload').click()}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mx-auto"
                  >
                    Add resource
                  </button>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  {selectedFile && (
                    <p className="mt-4 text-green-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Customize */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Customize your flashcards
              </h2>
              <div className="mt-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of cards
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={numCards}
                    onChange={(e) => setNumCards(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus topics (optional)
                  </label>
                  <textarea
                    value={customTopics}
                    onChange={(e) => setCustomTopics(e.target.value)}
                    placeholder="e.g. statistics, probability, integration, inverse, determinant"
                    className="w-full p-4 border border-gray-300 rounded-md text-sm bg-gray-100"
                    rows="4"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Separate topics with a comma
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generate */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Generate flashcards
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to generate your flashcards from the PDF.
              </p>
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Back to Flashcards
              </button>
            )}

            <button
              onClick={handleNextStep}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2 ${
                currentStep === 3
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-800 hover:bg-gray-900'
              } text-white rounded-md`}
            >
              {isLoading && currentStep === 3 && (
                <div className="animate-spin mr-2 h-4 w-4 border-2 rounded-full border-white border-t-transparent"></div>
              )}
              {currentStep === 3
                ? isLoading
                  ? 'Generating...'
                  : 'Generate'
                : 'Next'}
              {currentStep !== 3 && <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Display generated flashcards */}
      {flashcards && flashcards.cards && flashcards.cards.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{flashcards.title}</h2>
            <button
              onClick={handleSaveFlashcards}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Flashcards'}
            </button>
          </div>

          <div className="relative">
            <div
              className={`bg-white rounded-lg shadow-lg p-8 min-h-[300px] cursor-pointer transform transition-transform duration-500 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`${isFlipped ? 'hidden' : 'block'}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {currentCardIndex + 1} of {flashcards.cards.length}
                </h3>
                <p className="text-gray-700 text-lg">
                  {flashcards.cards[currentCardIndex].question}
                </p>
              </div>
              <div className={`${isFlipped ? 'block' : 'hidden'}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Answer</h3>
                <p className="text-gray-700 text-lg">
                  {flashcards.cards[currentCardIndex].answer}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextCard}
                disabled={currentCardIndex === flashcards.cards.length - 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display saved flashcards */}
      {!showUpload && savedFlashcards.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">Saved Flashcards</span>
            <div className="h-px bg-gradient-to-r from-blue-500 to-transparent flex-grow ml-4"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFlashcards.map((flashcard) => (
              <div
                key={flashcard.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {flashcard.data.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {flashcard.data.cards.length} cards
                </p>
                <button
                  onClick={() => {
                    setFlashcards(flashcard.data);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                    setShowUpload(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Flashcards
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFlashcards; 