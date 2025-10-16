import React from 'react';

const TailwindTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Tailwind CSS Test Page</h1>
          <p className="text-gray-600 mb-6">
            This page tests various Tailwind CSS utilities to ensure everything is working correctly.
          </p>
          
          {/* Color Test */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <h3 className="font-semibold">Blue Card</h3>
              <p className="text-blue-100">Primary color test</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <h3 className="font-semibold">Green Card</h3>
              <p className="text-green-100">Success color test</p>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg">
              <h3 className="font-semibold">Red Card</h3>
              <p className="text-red-100">Error color test</p>
            </div>
          </div>

          {/* Button Test */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
              Secondary Button
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg transition-colors">
              Outline Button
            </button>
          </div>

          {/* Form Test */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Form Elements Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Animation Test */}
          <div className="mt-6 text-center">
            <div className="inline-block animate-bounce bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
              Bouncing Animation Test
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTestPage;
