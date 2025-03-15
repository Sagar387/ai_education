import React from 'react';
import { Clock, Trophy, Star } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Study Plan</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Mathematics</h3>
                <p className="text-sm text-gray-500">09:00 - 10:30 AM</p>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Physics</h3>
                <p className="text-sm text-gray-500">11:00 - 12:30 PM</p>
              </div>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-flex">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">7 Day Streak</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full inline-flex">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Top Student</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full inline-flex">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">Quiz Master</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;