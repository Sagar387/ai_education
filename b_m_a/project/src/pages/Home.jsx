import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, LineChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 sm:py-24"
      >
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold sm:text-5xl md:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">AI-Powered Learning</span>
            <br />
            <span className="text-gray-900">For The Future</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience the next generation of learning with our AI-powered platform. 
            Personalized study plans, intelligent tools, and adaptive assessments to help you achieve your goals.
          </motion.p>
          <motion.div 
            className="mt-8 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/signup" className="button-primary inline-flex items-center">
              Get Started
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/tools" className="button-secondary inline-flex items-center">
              Explore Tools
              <BookOpen className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
            Why Choose StudyAI?
          </h2>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <FeatureCard 
              icon={Brain}
              title="AI-Driven Learning"
              description="Personalized study plans and recommendations based on your progress and learning style."
              color="text-primary-600"
              bgColor="bg-primary-50"
            />
            <FeatureCard 
              icon={BookOpen}
              title="Smart Study Tools"
              description="Interactive flashcards, voice notes, mind maps, and practice tests powered by AI."
              color="text-secondary-600"
              bgColor="bg-secondary-50"
            />
            <FeatureCard 
              icon={LineChart}
              title="Progress Tracking"
              description="Detailed analytics and insights to help you understand and improve your learning."
              color="text-green-600"
              bgColor="bg-green-50"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color, bgColor }) => (
  <motion.div 
    className="card-hover rounded-xl p-6 bg-white"
    whileHover={{ scale: 1.02 }}
  >
    <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default Home;