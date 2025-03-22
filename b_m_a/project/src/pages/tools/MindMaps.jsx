import React, { useState } from 'react';
import { Network as Network2, Plus } from 'lucide-react';

const MindMaps = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [newSubtopic, setNewSubtopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);

  const addTopic = () => {
    if (newTopic) {
      setTopics([...topics, { title: newTopic, subtopics: [] }]);
      setNewTopic('');
    }
  };

  const addSubtopic = (topicIndex) => {
    if (newSubtopic) {
      const updatedTopics = [...topics];
      updatedTopics[topicIndex].subtopics.push(newSubtopic);
      setTopics(updatedTopics);
      setNewSubtopic('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Network2 className="h-8 w-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mind Maps</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb- 4">Add New Topic</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter topic name"
          />
          <button
            onClick={addTopic}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Topic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{topic.title}</h3>
            <div className="space-y-2 mb-4">
              {topic.subtopics.map((subtopic, subtopicIndex) => (
                <div
                  key={subtopicIndex}
                  className="bg-green-50 p-2 rounded-md text-green-700"
                >
                  {subtopic}
                </div>
              ))}
            </div>
            {selectedTopic === topicIndex ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newSubtopic}
                  onChange={(e) => setNewSubtopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter subtopic"
                />
                <button
                  onClick={() => addSubtopic(topicIndex)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Subtopic
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSelectedTopic(topicIndex)}
                className="w-full px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                Add Subtopic
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindMaps;