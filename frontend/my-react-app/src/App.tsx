import { useState, useEffect } from 'react';
import { EvaluationForm } from './components/EvaluationForm';
import { EvaluationList } from './components/EvaluationList';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Users, FileText, BarChart3, LogOut, GraduationCap, Shield } from 'lucide-react';
import './style.css';
import './styles/globals.css';

export interface Evaluation {
  id: string;
  evaluatorName: string;
  peerName: string;
  date: string;
  criteria: {
    teamwork: number;
    communication: number;
    technicalSkills: number;
    problemSolving: number;
    leadership: number;
  };
  strengths: string;
  areasForImprovement: string;
  additionalComments: string;
  aiSuggestions?: string[];
}

type TabType = 'evaluate' | 'view' | 'dashboard';
type UserRole = 'student' | 'teacher' | 'admin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: UserRole } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('evaluate');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: '1',
      evaluatorName: 'Sarah Johnson',
      peerName: 'Michael Chen',
      date: '2025-11-28',
      criteria: {
        teamwork: 4,
        communication: 5,
        technicalSkills: 4,
        problemSolving: 5,
        leadership: 4,
      },
      strengths: 'Excellent problem-solving abilities and strong communication skills. Always willing to help team members.',
      areasForImprovement: 'Could take on more leadership responsibilities in project planning.',
      additionalComments: 'A valuable team member who consistently delivers quality work.',
      aiSuggestions: [
        'Consider highlighting specific examples of problem-solving instances',
        'Mention collaborative projects to strengthen teamwork feedback',
      ],
    },
    {
      id: '2',
      evaluatorName: 'Alex Rodriguez',
      peerName: 'Emma Williams',
      date: '2025-11-25',
      criteria: {
        teamwork: 5,
        communication: 4,
        technicalSkills: 5,
        problemSolving: 4,
        leadership: 5,
      },
      strengths: 'Natural leader with exceptional technical expertise. Great at mentoring junior team members.',
      areasForImprovement: 'Sometimes takes on too much responsibility, could delegate more effectively.',
      additionalComments: "Emma has been instrumental in our team's success this quarter.",
      aiSuggestions: [
        'Add specific metrics or outcomes to demonstrate impact',
        'Consider mentioning delegation as a growth opportunity',
      ],
    },
  ]);

  const handleSubmitEvaluation = (evaluation: Evaluation) => {
    setEvaluations([evaluation, ...evaluations]);
    setActiveTab('view');
  };

  const handleLogin = (email: string, name: string, role: UserRole) => {
    setCurrentUser({ email, name, role });
    setIsAuthenticated(true);
    localStorage.setItem('peereval_session', JSON.stringify({ email, name, role }));
  };

  const handleSignUp = (email: string, name: string, role: UserRole) => {
    setCurrentUser({ email, name, role });
    setIsAuthenticated(true);
    localStorage.setItem('peereval_session', JSON.stringify({ email, name, role }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('peereval_session');
  };

  // Check for existing session on component mount
  useEffect(() => {
    const session = localStorage.getItem('peereval_session');
    if (session) {
      const userData = JSON.parse(session);
      setCurrentUser(userData);
      setIsAuthenticated(true);
    }

    // Create demo accounts if they don't exist
    const users = JSON.parse(localStorage.getItem('peereval_users') || '[]');

    // Demo student account
    if (!users.some((u: any) => u.email === 'demo@example.com')) {
      users.push({
        id: 'demo',
        name: 'Demo Student',
        email: 'demo@example.com',
        password: 'demo123',
        role: 'student',
        createdAt: new Date().toISOString(),
        status: 'active',
      });
    }

    // Demo teacher account
    if (!users.some((u: any) => u.email === 'teacher@example.com')) {
      users.push({
        id: 'demo-teacher',
        name: 'Demo Teacher',
        email: 'teacher@example.com',
        password: 'teacher123',
        role: 'teacher',
        createdAt: new Date().toISOString(),
        status: 'active',
      });
    }

    // Demo admin account
    if (!users.some((u: any) => u.email === 'admin@example.com')) {
      users.push({
        id: 'demo-admin',
        name: 'Demo Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
        status: 'active',
      });
    }

    localStorage.setItem('peereval_users', JSON.stringify(users));
  }, []);

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    if (showLogin) {
      return <Login onLogin={handleLogin} onSwitchToSignup={() => setShowLogin(false)} />;
    }
    return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => setShowLogin(true)} />;
  }

  // Teacher View
  if (currentUser?.role === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div className="flex-1">
                <h1 className="text-indigo-600 mb-2">Peer Evaluation with AI</h1>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-900">Teacher</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800">{currentUser?.name}</p>
                    <p className="text-gray-500">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Manage students and peer evaluations with AI-powered insights</p>
          </div>

          {/* Teacher Dashboard */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <TeacherDashboard />
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  if (currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div className="flex-1">
                <h1 className="text-indigo-600 mb-2">Peer Evaluation with AI</h1>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-900">Admin</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800">{currentUser?.name}</p>
                    <p className="text-gray-500">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <p className="text-gray-600">Manage students and peer evaluations with AI-powered insights</p>
          </div>

          {/* Admin Dashboard */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <AdminDashboard />
          </div>
        </div>
      </div>
    );
  }

  // Student View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex-1">
              <h1 className="text-indigo-600 mb-2">Peer Evaluation with AI</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-800">{currentUser?.name}</p>
                  <p className="text-gray-500">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          <p className="text-gray-600">Comprehensive peer assessment powered by intelligent insights</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeTab === 'evaluate' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>New Evaluation</span>
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeTab === 'view' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>View Evaluations</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-md transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {activeTab === 'evaluate' && <EvaluationForm onSubmit={handleSubmitEvaluation} />}
          {activeTab === 'view' && <EvaluationList evaluations={evaluations} />}
          {activeTab === 'dashboard' && <Dashboard evaluations={evaluations} />}
        </div>
      </div>
    </div>
  );
}




