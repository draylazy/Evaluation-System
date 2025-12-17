import { useState, useEffect } from 'react';
import { UserManagement } from './UserManagement';
import { SystemAnalytics } from './SystemAnalytics';
import { SystemSettings } from './SystemSettings';
import { Users, BarChart3, Settings, Activity } from 'lucide-react';

// Basic types for admin data. These match the shapes used throughout the app
type UserRole = 'student' | 'teacher' | 'admin';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  status: string;
}

interface AdminAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
  status: 'active' | 'completed' | 'draft';
  minEvaluations: number;
  createdAt: string;
}

interface AdminEvaluation {
  id: string;
  assignmentId: string;
  studentId: string;
  status: 'submitted' | 'reviewed' | 'graded';
  [key: string]: any;
}

type AdminTab = 'users' | 'analytics' | 'settings' | 'activity';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
  const [evaluations, setEvaluations] = useState<AdminEvaluation[]>([]);

  // Load data from localStorage
  useEffect(() => {
    // Load users
    const loadedUsers = JSON.parse(
      localStorage.getItem('peereval_users') || '[]'
    );
    setUsers(loadedUsers);

    // Load assignments from teacher data
    const teacherAssignments = JSON.parse(
      localStorage.getItem('teacher_assignments') || '[]'
    );
    setAssignments(teacherAssignments);

    // Load evaluations from teacher data
    const teacherEvaluations = JSON.parse(
      localStorage.getItem('teacher_evaluations') || '[]'
    );
    setEvaluations(teacherEvaluations);
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('peereval_users', JSON.stringify(users));
    }
  }, [users]);

  const handleAddUser = (user: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (id: string, updatedUser: Partial<AdminUser>) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleSaveSettings = (settings: unknown) => {
    console.log('Saving settings:', settings);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-indigo-600 mb-2'>Admin Dashboard</h2>
        <p className='text-gray-600'>
          Manage system users, monitor analytics, and configure settings
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className='bg-white rounded-lg shadow-md p-2'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className='w-5 h-5' />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className='w-5 h-5' />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className='w-5 h-5' />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'activity'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className='w-5 h-5' />
            <span>Activity Log</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'users' && (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
        {activeTab === 'analytics' && (
          <SystemAnalytics
            users={users}
            assignments={assignments}
            evaluations={evaluations}
          />
        )}
        {activeTab === 'settings' && (
          <SystemSettings onSaveSettings={handleSaveSettings} />
        )}
        {activeTab === 'activity' && <ActivityLog />}
      </div>
    </div>
  );
}

// Activity Log Component
function ActivityLog() {
  const activities = [
    {
      id: '1',
      user: 'Demo Teacher',
      action: 'Created assignment',
      details: 'Mid-Semester Team Project Evaluation',
      timestamp: '2025-12-17 10:30 AM',
      type: 'assignment',
    },
    {
      id: '2',
      user: 'Demo Student',
      action: 'Submitted evaluation',
      details: 'Peer evaluation for Michael Chen',
      timestamp: '2025-12-17 09:15 AM',
      type: 'evaluation',
    },
    {
      id: '3',
      user: 'Admin',
      action: 'Updated system settings',
      details: 'Enabled AI suggestions',
      timestamp: '2025-12-16 04:45 PM',
      type: 'system',
    },
    {
      id: '4',
      user: 'Demo Teacher',
      action: 'Added student',
      details: 'Jamie Park to CS-102',
      timestamp: '2025-12-16 02:20 PM',
      type: 'user',
    },
    {
      id: '5',
      user: 'Demo Student',
      action: 'Logged in',
      details: 'Successful authentication',
      timestamp: '2025-12-16 08:30 AM',
      type: 'auth',
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-purple-100 text-purple-700';
      case 'evaluation':
        return 'bg-blue-100 text-blue-700';
      case 'system':
        return 'bg-red-100 text-red-700';
      case 'user':
        return 'bg-green-100 text-green-700';
      case 'auth':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-gray-800 mb-1'>Activity Log</h3>
        <p className='text-gray-600'>Recent system activity and user actions</p>
      </div>

      <div className='bg-white rounded-lg shadow-md'>
        <div className='divide-y divide-gray-200'>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className='p-6 hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span
                      className={`px-3 py-1 rounded-full capitalize ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {activity.type}
                    </span>
                    <span className='text-gray-800'>{activity.user}</span>
                  </div>
                  <p className='text-gray-700 mb-1'>{activity.action}</p>
                  <p className='text-gray-600'>{activity.details}</p>
                </div>
                <span className='text-gray-500 whitespace-nowrap ml-4'>
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <p className='text-gray-600'>Today</p>
          <p className='text-gray-900 mt-1'>24 activities</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <p className='text-gray-600'>This Week</p>
          <p className='text-gray-900 mt-1'>156 activities</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <p className='text-gray-600'>Evaluations</p>
          <p className='text-gray-900 mt-1'>89 submitted</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <p className='text-gray-600'>Assignments</p>
          <p className='text-gray-900 mt-1'>12 created</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-4'>
          <p className='text-gray-600'>User Logins</p>
          <p className='text-gray-900 mt-1'>342 sessions</p>
        </div>
      </div>
    </div>
  );
}
