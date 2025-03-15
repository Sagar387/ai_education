import React, { useState } from 'react';
import { TestTube, Check, X } from 'lucide-react';

const PracticeTests = () => {
  const [questions, setQuestions] = useState<{
    question: string;
    options: string[];
    correctAnswer: number;
  }[]>([
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <TestTube className="h-8 w-8 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Practice Tests</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <h2 className="text-xl font-medium text-gray-900 mt-2">
            {questions[currentQuestion].question}
          </h2>
        </div>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg border ${
                showResult
                  ? index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-50 border-green-500'
                    : index === selectedAnswer
                    ? 'bg-red-50 border-red-500'
                    : 'border-gray-200'
                  : 'border-gray-200 hover:border-red-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && index === questions[currentQuestion].correctAnswer && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {showResult && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeTests;