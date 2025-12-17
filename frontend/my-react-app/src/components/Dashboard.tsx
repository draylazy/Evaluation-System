import { Evaluation } from '../App';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Users, Star, TrendingUp, Award } from 'lucide-react';

interface DashboardProps {
  evaluations: Evaluation[];
}

export function Dashboard({ evaluations }: DashboardProps) {
  // Calculate statistics
  const totalEvaluations = evaluations.length;
  const uniquePeers = new Set(evaluations.map(e => e.peerName)).size;

  const allScores = evaluations.map(e => {
    const values = Object.values(e.criteria);
    return values.reduce((a, b) => a + b, 0) / values.length;
  });

  const averageScore = allScores.length > 0
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
    : '0.00';

  // Prepare data for criteria chart
  const criteriaData = [
    { name: 'Teamwork', value: 0 },
    { name: 'Communication', value: 0 },
    { name: 'Technical Skills', value: 0 },
    { name: 'Problem Solving', value: 0 },
    { name: 'Leadership', value: 0 },
  ];

  evaluations.forEach(evaluation => {
    criteriaData[0].value += evaluation.criteria.teamwork;
    criteriaData[1].value += evaluation.criteria.communication;
    criteriaData[2].value += evaluation.criteria.technicalSkills;
    criteriaData[3].value += evaluation.criteria.problemSolving;
    criteriaData[4].value += evaluation.criteria.leadership;
  });

  if (evaluations.length > 0) {
    criteriaData.forEach(item => {
      item.value = parseFloat((item.value / evaluations.length).toFixed(2));
    });
  }

  // Prepare data for peer comparison
  const peerScores: { [key: string]: { total: number; count: number } } = {};

  evaluations.forEach(evaluation => {
    if (!peerScores[evaluation.peerName]) {
      peerScores[evaluation.peerName] = { total: 0, count: 0 };
    }
    const values = Object.values(evaluation.criteria);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    peerScores[evaluation.peerName].total += avg;
    peerScores[evaluation.peerName].count += 1;
  });

  const peerData = Object.entries(peerScores).map(([name, data]) => ({
    name,
    score: parseFloat((data.total / data.count).toFixed(2)),
  }));

  // Find top performer
  const topPerformer = peerData.length > 0
    ? peerData.reduce((prev, current) => (prev.score > current.score) ? prev : current)
    : null;

  return (
    <div className="w-screen h-screen overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
      {/* Fullscreen container */}
      <div className="min-h-full flex flex-col space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-300">
            Comprehensive insights and performance metrics
          </p>
        </div>

        {evaluations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 italic">
            <p>No evaluation data available. Submit evaluations to see analytics.</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-white/20 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-9 h-9 text-indigo-500" />
                  <span className="text-indigo-400 font-semibold">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{totalEvaluations}</p>
                <p className="text-indigo-400 font-medium">Evaluations</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-white/20 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-9 h-9 text-purple-500" />
                  <span className="text-purple-400 font-semibold">Unique</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{uniquePeers}</p>
                <p className="text-purple-400 font-medium">Peers Evaluated</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-white/20 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Star className="w-9 h-9 text-green-500" />
                  <span className="text-green-400 font-semibold">Average</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{averageScore}/5.0</p>
                <p className="text-green-400 font-medium">Overall Score</p>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 border border-white/20 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Award className="w-9 h-9 text-orange-500" />
                  <span className="text-orange-400 font-semibold">Top</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 truncate">{topPerformer?.name || 'N/A'}</p>
                <p className="text-orange-400 font-medium">Performer</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Average Scores by Criteria */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-gray-800 dark:text-gray-100 mb-4 text-xl font-semibold">Average Scores by Criteria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={criteriaData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" angle={-20} textAnchor="end" height={70} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-gray-800 dark:text-gray-100 mb-4 text-xl font-semibold">Performance Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={criteriaData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" stroke={document.body.classList.contains('dark') ? '#f5f5f5' : '#1a1a1a'} />
                    <PolarRadiusAxis domain={[0, 5]} stroke={document.body.classList.contains('dark') ? '#f5f5f5' : '#1a1a1a'} />
                    <Radar name="Average Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peer Comparison */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-gray-800 dark:text-gray-100 mb-4 text-xl font-semibold">Peer Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peerData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                  <XAxis dataKey="name" stroke={document.body.classList.contains('dark') ? '#f5f5f5' : '#1a1a1a'} />
                  <YAxis domain={[0, 5]} stroke={document.body.classList.contains('dark') ? '#f5f5f5' : '#1a1a1a'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[6,6,0,0]} name="Average Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
