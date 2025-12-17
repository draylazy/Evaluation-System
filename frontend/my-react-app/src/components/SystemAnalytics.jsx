import { Users, FileText, ClipboardCheck, TrendingUp, Activity, BookOpen } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SystemAnalytics({ users, assignments, evaluations }) {
  // User role distribution
  const userRoleData = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length, color: '#3B82F6' },
    { name: 'Teachers', value: users.filter(u => u.role === 'teacher').length, color: '#A855F7' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#EF4444' },
  ];

  // User growth over time (last 6 months)
  const getMonthlyUserGrowth = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      users: Math.floor(users.length * (0.5 + (index * 0.1))),
    }));
  };

  // Evaluation status distribution
  const evaluationStatusData = [
    { name: 'Submitted', value: evaluations.filter(e => e.status === 'submitted').length, color: '#F59E0B' },
    { name: 'Reviewed', value: evaluations.filter(e => e.status === 'reviewed').length, color: '#3B82F6' },
    { name: 'Graded', value: evaluations.filter(e => e.status === 'graded').length, color: '#10B981' },
  ];

  // Assignment status distribution
  const assignmentStatusData = [
    { name: 'Active', count: assignments.filter(a => a.status === 'active').length },
    { name: 'Completed', count: assignments.filter(a => a.status === 'completed').length },
    { name: 'Draft', count: assignments.filter(a => a.status === 'draft').length },
  ];

  // Average scores by criteria
  const criteriaAverages = evaluations.length > 0 ? [
    { 
      name: 'Teamwork', 
      score: evaluations.reduce((sum, e) => sum + e.criteria.teamwork, 0) / evaluations.length 
    },
    { 
      name: 'Communication', 
      score: evaluations.reduce((sum, e) => sum + e.criteria.communication, 0) / evaluations.length 
    },
    { 
      name: 'Technical', 
      score: evaluations.reduce((sum, e) => sum + e.criteria.technicalSkills, 0) / evaluations.length 
    },
    { 
      name: 'Problem Solving', 
      score: evaluations.reduce((sum, e) => sum + e.criteria.problemSolving, 0) / evaluations.length 
    },
    { 
      name: 'Leadership', 
      score: evaluations.reduce((sum, e) => sum + e.criteria.leadership, 0) / evaluations.length 
    },
  ] : [];

  // Activity over time (last 7 days)
  const getRecentActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day) => ({
      day,
      evaluations: Math.floor(Math.random() * 20) + 5,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-800 mb-1">System Analytics</h3>
        <p className="text-gray-600">Comprehensive overview of system-wide metrics and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Users</p>
              <p className="text-white mt-2">{users.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-blue-100">
            <TrendingUp className="w-4 h-4" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Assignments</p>
              <p className="text-white mt-2">{assignments.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-purple-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-purple-100">
            <Activity className="w-4 h-4" />
            <span>{assignments.filter(a => a.status === 'active').length} active</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Evaluations</p>
              <p className="text-white mt-2">{evaluations.length}</p>
            </div>
            <FileText className="w-12 h-12 text-green-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-100">
            <TrendingUp className="w-4 h-4" />
            <span>+8% this week</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending Reviews</p>
              <p className="text-white mt-2">{evaluations.filter(e => e.status === 'submitted').length}</p>
            </div>
            <ClipboardCheck className="w-12 h-12 text-orange-200" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-orange-100">
            <Activity className="w-4 h-4" />
            <span>Needs attention</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 mb-4">User Distribution by Role</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Evaluation Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 mb-4">Evaluation Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={evaluationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {evaluationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 mb-4">User Growth Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getMonthlyUserGrowth()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 mb-4">Evaluation Activity (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getRecentActivity()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="evaluations" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Scores by Criteria */}
        {criteriaAverages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-gray-800 mb-4">Average Scores by Criteria</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={criteriaAverages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Assignment Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 mb-4">Assignment Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assignmentStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#A855F7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-gray-800 mb-4">System Health Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Active Users</span>
              <span className="text-green-600">98%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Completion Rate</span>
              <span className="text-blue-600">87%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">System Uptime</span>
              <span className="text-indigo-600">99.9%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


