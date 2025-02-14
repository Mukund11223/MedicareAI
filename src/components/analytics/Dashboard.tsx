import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Download, Calendar, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  patientVisits: number[];
  treatmentOutcomes: {
    successful: number;
    ongoing: number;
    referred: number;
  };
  appointments: {
    completed: number;
    scheduled: number;
    cancelled: number;
  };
  revenue: number[];
  resourceUtilization: {
    rooms: number;
    equipment: number;
    staff: number;
  };
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    patientVisits: [],
    treatmentOutcomes: { successful: 0, ongoing: 0, referred: 0 },
    appointments: { completed: 0, scheduled: 0, cancelled: 0 },
    revenue: [],
    resourceUtilization: { rooms: 0, equipment: 0, staff: 0 },
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    // Fetch analytics data from Supabase
    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .gte('scheduled_at', dateRange.start)
      .lte('scheduled_at', dateRange.end);

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      return;
    }

    // Process and update analytics data
    // This is a simplified example - in a real app, you'd process the data more thoroughly
    setAnalyticsData({
      patientVisits: [65, 59, 80, 81, 56, 55, 40],
      treatmentOutcomes: {
        successful: 75,
        ongoing: 20,
        referred: 5,
      },
      appointments: {
        completed: appointmentsData?.filter(a => a.status === 'completed').length || 0,
        scheduled: appointmentsData?.filter(a => a.status === 'scheduled').length || 0,
        cancelled: appointmentsData?.filter(a => a.status === 'cancelled').length || 0,
      },
      revenue: [2800, 3200, 3100, 3500, 3000, 3800, 3200],
      resourceUtilization: {
        rooms: 85,
        equipment: 72,
        staff: 90,
      },
    });
  };

  const exportData = () => {
    const data = {
      dateRange,
      analytics: analyticsData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange.start}-to-${dateRange.end}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const visitData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patient Visits',
        data: analyticsData.patientVisits,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: analyticsData.revenue,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  const outcomeData = {
    labels: ['Successful', 'Ongoing', 'Referred'],
    datasets: [
      {
        data: [
          analyticsData.treatmentOutcomes.successful,
          analyticsData.treatmentOutcomes.ongoing,
          analyticsData.treatmentOutcomes.referred,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your healthcare metrics and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold">{analyticsData.patientVisits.reduce((a, b) => a + b, 0)}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Appointments</p>
              <h3 className="text-2xl font-bold">
                {analyticsData.appointments.completed + analyticsData.appointments.scheduled}
              </h3>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Revenue</p>
              <h3 className="text-2xl font-bold">${analyticsData.revenue.reduce((a, b) => a + b, 0).toLocaleString()}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Resource Usage</p>
              <h3 className="text-2xl font-bold">{analyticsData.resourceUtilization.rooms}%</h3>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Patient Visits</h3>
          <Line data={visitData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <Bar data={revenueData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Treatment Outcomes</h3>
          <div className="h-64">
            <Doughnut data={outcomeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Resource Utilization</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.resourceUtilization).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <span className="text-sm text-gray-500">{value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}