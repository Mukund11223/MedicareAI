import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Activity, Brain, Calendar, MessageSquare, Stethoscope } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const healthData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Heart Rate',
        data: [72, 75, 73, 78, 74, 72, 76],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Health Metrics',
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-2">Here's your health overview for today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Activity className="h-8 w-8 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold">Heart Rate</h3>
          <p className="text-2xl font-bold text-blue-600">72 BPM</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Brain className="h-8 w-8 text-purple-600 mb-2" />
          <h3 className="text-lg font-semibold">AI Prediction</h3>
          <p className="text-sm text-gray-600">Low risk of cardiovascular issues</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Calendar className="h-8 w-8 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold">Next Appointment</h3>
          <p className="text-sm text-gray-600">March 15, 2024 - 10:00 AM</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
          <h3 className="text-lg font-semibold">AI Chat</h3>
          <p className="text-sm text-gray-600">Ask health-related questions</p>
        </div>
      </div>

      {/* Health Metrics Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <Line options={chartOptions} data={healthData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium">Medical Record Updated</p>
              <p className="text-sm text-gray-600">Dr. Smith added new ECG results</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-medium">AI Analysis Complete</p>
              <p className="text-sm text-gray-600">Health risk assessment updated</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;