import React from 'react';
import { Activity, MessageSquare, Users, FileText, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorCollaboration = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
        <p className="text-gray-600 mt-2">Collaborate with healthcare professionals and manage patient cases</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold">Team Collaboration</h3>
          <p className="text-gray-600 mt-2">Connect with other healthcare professionals</p>
          <button 
            onClick={() => navigate('/team-chat')}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Team Discussion
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <MessageSquare className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold">Secure Messaging</h3>
          <p className="text-gray-600 mt-2">HIPAA-compliant communication</p>
          <button 
            onClick={() => navigate('/team-chat')}
            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Open Messages
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Activity className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold">Case Analytics</h3>
          <p className="text-gray-600 mt-2">AI-powered case analysis and insights</p>
          <button 
            onClick={() => navigate('/analytics')}
            className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Cases</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Patient: John Doe</span>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600">Updated diagnosis and treatment plan</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Patient: Sarah Smith</span>
                </div>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
              <p className="text-sm text-gray-600">Virtual consultation completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Pattern Detection</h3>
              <p className="text-sm text-blue-700 mt-1">Similar symptoms detected across 3 recent cases</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Treatment Efficacy</h3>
              <p className="text-sm text-purple-700 mt-1">85% success rate in current treatment plans</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Resource Optimization</h3>
              <p className="text-sm text-green-700 mt-1">Suggested schedule adjustments for better patient care</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCollaboration;