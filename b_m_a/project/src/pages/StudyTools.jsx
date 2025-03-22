import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mic, Network as Network2, TestTube, Sparkles, BookOpen, PenTool, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const StudyTools = () => {
  const tools = [
    {
      to: "/tools/flashcards",
      icon: Brain,
      title: "AI Flashcards",
      description: "Generate smart flashcards from your notes",
      color: "text-primary-600",
      bgColor: "bg-primary-50",
      borderColor: "border-primary-100",
    },
    {
      to: "/tools/voice-notes",
      icon: Mic,
      title: "Voice Notes",
      description: "Convert speech to organized notes",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      to: "/tools/mind-maps",
      icon: Network2,
      title: "Mind Maps",
      description: "Visual learning aids for complex topics",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      to: "/tools/practice-tests",
      icon: TestTube,
      title: "Practice Tests",
      description: "AI-powered assessments",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
    },
    {
      to: "/tools/summarizer",
      icon: Zap,
      title: "Smart Summarizer",
      description: "Get concise summaries of any text",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
    },
    {
      to: "/tools/study-planner",
      icon: PenTool,
      title: "Study Planner",
      description: "Create optimized study schedules",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
        >
          Smart Study Tools
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Enhance your learning experience with our AI-powered study tools
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool, index) => (
          <ToolCard key={index} {...tool} index={index} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white text-center"
      >
        <div className="flex justify-center mb-4">
          <Sparkles className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Unlock Premium Tools</h2>
        <p className="mb-6 text-white/90">
          Get access to advanced features and personalized learning experiences
        </p>
        <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2">
          Upgrade Now
          <BookOpen className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
};

const ToolCard = ({ to, icon: Icon, title, description, color, bgColor, borderColor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index }}
  >
    <Link
      to={to}
      className={`block p-6 rounded-xl bg-white border ${borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
    >
      <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  </motion.div>
);

export default StudyTools;