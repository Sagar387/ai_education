import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, LineChart } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          AI-Powered Learning Platform
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Personalized study plans, smart tools, and adaptive assessments to maximize your learning potential.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Link
            to="/signup"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Key Features
        </h2>
        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="text-center">
            <div className="flex justify-center">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">AI-Driven Learning</h3>
            <p className="mt-2 text-base text-gray-500">
              Personalized study plans and recommendations based on your progress
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">Smart Study Tools</h3>
            <p className="mt-2 text-base text-gray-500">
              Dynamic flashcards, summaries, and quizzes based on your needs
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <LineChart className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">Progress Tracking</h3>
            <p className="mt-2 text-base text-gray-500">
              Real-time analytics for students with detailed insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;