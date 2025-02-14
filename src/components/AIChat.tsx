import React, { useState } from 'react';
import { Send, Bot, AlertCircle, GraduationCap, Award, Stethoscope, MapPin, Star } from 'lucide-react';
import { getAIResponse } from '../lib/openai';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  education: string;
  experience: number;
  expertise: string[];
  rating: number;
  distance: string;
  image: string;
}

const nearbyDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    education: 'Harvard Medical School',
    experience: 15,
    expertise: ['Heart Disease', 'Hypertension', 'Preventive Cardiology'],
    rating: 4.9,
    distance: '0.8 miles',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Endocrinologist',
    education: 'Stanford University School of Medicine',
    experience: 12,
    expertise: ['Diabetes', 'Thyroid Disorders', 'Hormonal Imbalances'],
    rating: 4.8,
    distance: '1.2 miles',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Neurologist',
    education: 'Johns Hopkins School of Medicine',
    experience: 10,
    expertise: ['Headaches', 'Movement Disorders', 'Multiple Sclerosis'],
    rating: 4.7,
    distance: '1.5 miles',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Pulmonologist',
    education: 'Yale School of Medicine',
    experience: 18,
    expertise: ['Asthma', 'COPD', 'Sleep Disorders'],
    rating: 4.9,
    distance: '2.0 miles',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    id: '5',
    name: 'Dr. Lisa Patel',
    specialty: 'Rheumatologist',
    education: 'Columbia University Medical Center',
    experience: 14,
    expertise: ['Arthritis', 'Autoimmune Disorders', 'Osteoporosis'],
    rating: 4.8,
    distance: '2.3 miles',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300'
  }
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'Hello! I\'m your AI health assistant. How can I help you today? Remember, while I can provide general information, please consult healthcare professionals for specific medical advice.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    try {
      const aiResponse = await getAIResponse(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: aiResponse || 'I apologize, but I\'m having trouble processing your request.' }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'I apologize, but I\'m having trouble processing your request. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat Section */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Health Assistant</h1>
          <p className="text-gray-600 mt-2">Get instant medical advice and guidance</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6 mb-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.role === 'bot' && (
                    <Bot className="h-5 w-5 mb-2 text-blue-600" />
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-4 rounded-lg bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your health-related question..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white p-3 rounded-lg transition-colors`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <p>
              This AI assistant provides general guidance only. For emergencies, please call 911 or visit the nearest emergency room.
            </p>
          </div>
        </div>
      </div>

      {/* Nearby Doctors Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Doctors Nearby</h2>
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-6">
            {nearbyDoctors.map((doctor) => (
              <div key={doctor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-blue-600">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{doctor.education}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {doctor.expertise.map((exp, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{doctor.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;