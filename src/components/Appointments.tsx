import React, { useState } from 'react';
import { Calendar, Clock, User, Video } from 'lucide-react';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
        <p className="text-gray-600 mt-2">Book your next visit with our healthcare professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appointment Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Book an Appointment</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setAppointmentType('in-person')}
                  className={`p-4 rounded-lg border flex items-center justify-center space-x-2 ${
                    appointmentType === 'in-person'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-600'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>In-Person</span>
                </button>
                <button
                  onClick={() => setAppointmentType('video')}
                  className={`p-4 rounded-lg border flex items-center justify-center space-x-2 ${
                    appointmentType === 'video'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-600'
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span>Video Call</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg border ${
                      selectedTime === time
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Confirm Appointment
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Upcoming Appointments</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">March 15, 2024</span>
                </div>
                <span className="text-sm text-gray-500">In-Person</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>10:00 AM</span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-600">General Check-up</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Reschedule
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">March 20, 2024</span>
                </div>
                <span className="text-sm text-gray-500">Video Call</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>2:00 PM</span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium">Dr. Michael Chen</p>
                <p className="text-sm text-gray-600">Follow-up Consultation</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Reschedule
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;