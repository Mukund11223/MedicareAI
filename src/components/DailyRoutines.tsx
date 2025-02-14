import React, { useState } from 'react';
import { Clock, Heart, Utensils, Activity, Sun, Moon, Pill, Droplets } from 'lucide-react';

interface RoutineStep {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface DiseaseRoutine {
  name: string;
  description: string;
  steps: RoutineStep[];
}

const routines: DiseaseRoutine[] = [
  {
    name: "Diabetes Management",
    description: "Daily routine for optimal blood sugar control",
    steps: [
      {
        time: "7:00 AM",
        title: "Morning Blood Sugar Check",
        description: "Check blood sugar levels before breakfast",
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
        completed: false
      },
      {
        time: "7:15 AM",
        title: "Morning Medication",
        description: "Take prescribed diabetes medication",
        icon: <Pill className="h-5 w-5 text-purple-500" />,
        completed: false
      },
      {
        time: "7:30 AM",
        title: "Balanced Breakfast",
        description: "Eat a low-glycemic breakfast with protein",
        icon: <Utensils className="h-5 w-5 text-green-500" />,
        completed: false
      },
      {
        time: "12:00 PM",
        title: "Pre-lunch Check",
        description: "Check blood sugar before lunch",
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
        completed: false
      },
      {
        time: "3:00 PM",
        title: "Afternoon Exercise",
        description: "30 minutes of moderate activity",
        icon: <Activity className="h-5 w-5 text-red-500" />,
        completed: false
      },
      {
        time: "6:00 PM",
        title: "Evening Check",
        description: "Check blood sugar before dinner",
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
        completed: false
      },
      {
        time: "10:00 PM",
        title: "Night Routine",
        description: "Final blood sugar check and medication",
        icon: <Moon className="h-5 w-5 text-indigo-500" />,
        completed: false
      }
    ]
  },
  {
    name: "Hypertension Management",
    description: "Daily routine for blood pressure control",
    steps: [
      {
        time: "6:30 AM",
        title: "Morning BP Check",
        description: "Check blood pressure after waking",
        icon: <Heart className="h-5 w-5 text-red-500" />,
        completed: false
      },
      {
        time: "7:00 AM",
        title: "Morning Medication",
        description: "Take blood pressure medication",
        icon: <Pill className="h-5 w-5 text-purple-500" />,
        completed: false
      },
      {
        time: "8:00 AM",
        title: "Light Exercise",
        description: "20-minute walk or stretching",
        icon: <Activity className="h-5 w-5 text-green-500" />,
        completed: false
      },
      {
        time: "12:00 PM",
        title: "Lunch",
        description: "Low-sodium meal with vegetables",
        icon: <Utensils className="h-5 w-5 text-orange-500" />,
        completed: false
      },
      {
        time: "6:00 PM",
        title: "Evening BP Check",
        description: "Check blood pressure before dinner",
        icon: <Heart className="h-5 w-5 text-red-500" />,
        completed: false
      }
    ]
  },
  {
    name: "Asthma Management",
    description: "Daily routine for asthma control",
    steps: [
      {
        time: "7:00 AM",
        title: "Morning Peak Flow",
        description: "Check peak flow meter reading",
        icon: <Activity className="h-5 w-5 text-blue-500" />,
        completed: false
      },
      {
        time: "7:15 AM",
        title: "Morning Inhaler",
        description: "Use preventive inhaler as prescribed",
        icon: <Pill className="h-5 w-5 text-purple-500" />,
        completed: false
      },
      {
        time: "2:00 PM",
        title: "Afternoon Check",
        description: "Monitor symptoms and use inhaler if needed",
        icon: <Activity className="h-5 w-5 text-blue-500" />,
        completed: false
      },
      {
        time: "9:00 PM",
        title: "Evening Routine",
        description: "Evening peak flow check and medication",
        icon: <Moon className="h-5 w-5 text-indigo-500" />,
        completed: false
      }
    ]
  }
];

const DailyRoutines = () => {
  const [selectedRoutine, setSelectedRoutine] = useState(routines[0]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (time: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(time)) {
      newCompleted.delete(time);
    } else {
      newCompleted.add(time);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Daily Health Routines</h2>
        <p className="text-gray-600 mt-2">Manage your daily health routines and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {routines.map((routine) => (
          <button
            key={routine.name}
            onClick={() => setSelectedRoutine(routine)}
            className={`p-6 rounded-xl text-left transition-all ${
              selectedRoutine.name === routine.name
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border-2 border-transparent hover:border-blue-200'
            }`}
          >
            <h3 className="font-semibold text-lg">{routine.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{routine.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">{selectedRoutine.name}</h3>
            <p className="text-gray-600">{selectedRoutine.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {selectedRoutine.steps.filter((_, i) => completedSteps.has(selectedRoutine.steps[i].time)).length} of {selectedRoutine.steps.length} completed
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {selectedRoutine.steps.map((step) => (
            <div
              key={step.time}
              className={`flex items-center p-4 rounded-lg transition-colors ${
                completedSteps.has(step.time)
                  ? 'bg-green-50'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0 w-20">
                <span className="text-sm font-medium text-gray-600">{step.time}</span>
              </div>
              <div className="flex-shrink-0 mx-4">{step.icon}</div>
              <div className="flex-grow">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <button
                onClick={() => toggleStep(step.time)}
                className={`ml-4 p-2 rounded-full transition-colors ${
                  completedSteps.has(step.time)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Activity className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyRoutines;