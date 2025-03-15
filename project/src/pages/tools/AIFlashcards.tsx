import React, { useState } from 'react';
import { Brain, Plus, X } from 'lucide-react';

const AIFlashcards = () => {
  const [cards, setCards] = useState<{ question: string; answer: string }[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const addCard = () => {
    if (newQuestion && newAnswer) {
      setCards([...cards, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Brain className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Flashcards</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Flashcard</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your question"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter the answer"
            />
          </div>
          <button
            onClick={addCard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm relative group">
            <button
              onClick={() => removeCard(index)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-medium text-gray-900 mb-2">Question:</h3>
            <p className="text-gray-600 mb-4">{card.question}</p>
            <h3 className="font-medium text-gray-900 mb-2">Answer:</h3>
            <p className="text-gray-600">{card.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIFlashcards;