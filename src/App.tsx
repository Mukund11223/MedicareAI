import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FileText, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MedicalRecords from './components/MedicalRecords';
import AIChat from './components/AIChat';
import Appointments from './components/Appointments';
import DoctorCollaboration from './components/DoctorCollaboration';
import SignIn from './components/auth/SignIn';
import Chat from './components/collaboration/Chat';
import AnalyticsDashboard from './components/analytics/Dashboard';
import DailyRoutines from './components/DailyRoutines';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">MediCare AI</span>
              </div>

              {/* Mobile menu button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
                <Link to="/records" className="text-gray-500 hover:text-gray-900">Medical Records</Link>
                <Link to="/routines" className="text-gray-500 hover:text-gray-900">Daily Routines</Link>
                <Link to="/chat" className="text-gray-500 hover:text-gray-900">AI Chat</Link>
                <Link to="/appointments" className="text-gray-500 hover:text-gray-900">Appointments</Link>
                <Link to="/collaboration" className="text-gray-500 hover:text-gray-900">Doctor Portal</Link>
              </nav>

              <Link 
                to="/signin" 
                className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <nav className="md:hidden mt-4 space-y-2">
                <Link to="/" className="block py-2 text-gray-500 hover:text-gray-900">Dashboard</Link>
                <Link to="/records" className="block py-2 text-gray-500 hover:text-gray-900">Medical Records</Link>
                <Link to="/routines" className="block py-2 text-gray-500 hover:text-gray-900">Daily Routines</Link>
                <Link to="/chat" className="block py-2 text-gray-500 hover:text-gray-900">AI Chat</Link>
                <Link to="/appointments" className="block py-2 text-gray-500 hover:text-gray-900">Appointments</Link>
                <Link to="/collaboration" className="block py-2 text-gray-500 hover:text-gray-900">Doctor Portal</Link>
                <Link 
                  to="/signin"
                  className="block w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-center"
                >
                  Sign In
                </Link>
              </nav>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/records" element={<MedicalRecords />} />
            <Route path="/routines" element={<DailyRoutines />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/collaboration" element={<DoctorCollaboration />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/team-chat" element={<Chat />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;