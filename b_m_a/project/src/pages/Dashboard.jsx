import React from 'react';
import { Clock, Trophy, Star, Target, BookOpen, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const teachers = [
    { name: "Dr. Sarah Wilson", subject: "Mathematics", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { name: "Prof. Michael Chen", subject: "Physics", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
  ];

  const schedule = [
    { subject: "Mathematics", time: "09:00 - 10:30 AM", teacher: "Dr. Sarah Wilson" },
    { subject: "Physics", time: "11:00 - 12:30 PM", teacher: "Prof. Michael Chen" },
    { subject: "Study Group", time: "02:00 - 03:30 PM", teacher: "Peer Learning" },
  ];

  const goals = [
    { title: "Complete Calculus Module", progress: 75 },
    { title: "Physics Lab Report", progress: 40 },
    { title: "Weekly Quiz Prep", progress: 90 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Teachers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Teachers</h2>
          </div>
          <div className="space-y-4">
            {teachers.map((teacher, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img src={teacher.image} alt={teacher.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-medium text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
          </div>
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{item.subject}</h3>
                  <span className="text-sm text-primary-600">{item.time}</span>
                </div>
                <p className="text-sm text-gray-500">{item.teacher}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Learning Goals</h2>
          </div>
          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">{goal.title}</h3>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AchievementCard
              icon={Trophy}
              title="7 Day Streak"
              description="Consistent learning pays off!"
              color="text-blue-600"
              bgColor="bg-blue-100"
            />
            <AchievementCard
              icon={Star}
              title="Top Student"
              description="Ranked #1 in Physics"
              color="text-yellow-600"
              bgColor="bg-yellow-100"
            />
            <AchievementCard
              icon={BookOpen}
              title="Quick Learner"
              description="Completed 5 modules this week"
              color="text-green-600"
              bgColor="bg-green-100"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const AchievementCard = ({ icon: Icon, title, description, color, bgColor }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-lg bg-gray-50 flex items-start gap-4"
  >
    <div className={`${bgColor} p-3 rounded-lg`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </motion.div>
);

export default Dashboard;