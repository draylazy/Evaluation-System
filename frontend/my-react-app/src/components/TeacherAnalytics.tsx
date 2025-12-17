import { Student, Assignment, StudentEvaluation } from './TeacherDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface TeacherAnalyticsProps {
  students: Student[];
  assignments: Assignment[];
  evaluations: StudentEvaluation[];
}

export function TeacherAnalytics({ students, assignments, evaluations }: TeacherAnalyticsProps) {
  // Calculate student participation
  const studentParticipation = students.map(student => {
    const studentEvals = evaluations.filter(e => e.studentId === student.id);
    return {
      name: student.name,
      evaluations: studentEvals.length,
      avgGrade: studentEvals.filter(e => e.teacherGrade).length > 0
        ? Math.round(
            studentEvals
              .filter(e => e.teacherGrade)
              .reduce((sum, e) => sum + (e.teacherGrade || 0), 0) /
            studentEvals.filter(e => e.teacherGrade).length
          )
        : 0,
    };
  }).sort((a, b) => b.evaluations - a.evaluations);

  // Class performance by class
  const classPerformance = Array.from(new Set(students.map(s => s.class))).map(className => {
    const classStudents = students.filter(s => s.class === className);
    const classEvals = evaluations.filter(e => 
      classStudents.some(s => s.id === e.studentId)
    );
    
    const gradedEvals = classEvals.filter(e => e.teacherGrade);
    const avgGrade = gradedEvals.length > 0
      ? gradedEvals.reduce((sum, e) => sum + (e.teacherGrade || 0), 0) / gradedEvals.length
      : 0;

    const avgCriteriaScore = classEvals.length > 0
      ? classEvals.reduce((sum, e) => {
          const criteriaAvg = Object.values(e.criteria).reduce((a, b) => a + b, 0) / Object.values(e.criteria).length;
          return sum + criteriaAvg;
        }, 0) / classEvals.length
      : 0;

    return {
      class: className,
      students: classStudents.length,
      evaluations: classEvals.length,
      avgGrade: Math.round(avgGrade),
      avgCriteriaScore: parseFloat(avgCriteriaScore.toFixed(2)),
    };
  });

  // Criteria performance across all evaluations
  const criteriaData = [
    { name: 'Teamwork', value: 0, count: 0 },
    { name: 'Communication', value: 0, count: 0 },
    { name: 'Technical Skills', value: 0, count: 0 },
    { name: 'Problem Solving', value: 0, count: 0 },
    { name: 'Leadership', value: 0, count: 0 },
  ];

  evaluations.forEach(evaluation => {
    criteriaData[0].value += evaluation.criteria.teamwork;
    criteriaData[0].count += 1;
    criteriaData[1].value += evaluation.criteria.communication;
    criteriaData[1].count += 1;
    criteriaData[2].value += evaluation.criteria.technicalSkills;
    criteriaData[2].count += 1;
    criteriaData[3].value += evaluation.criteria.problemSolving;
    criteriaData[3].count += 1;
    criteriaData[4].value += evaluation.criteria.leadership;
    criteriaData[4].count += 1;
  });

  criteriaData.forEach(item => {
    if (item.count > 0) {
      item.value = parseFloat((item.value / item.count).toFixed(2));
    }
  });

  // Evaluation status distribution
  const statusData = [
    { name: 'Submitted', value: evaluations.filter(e => e.status === 'submitted').length },
    { name: 'Reviewed', value: evaluations.filter(e => e.status === 'reviewed').length },
    { name: 'Graded', value: evaluations.filter(e => e.status === 'graded').length },
  ].filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#eab308', '#22c55e'];

  // AI Insights
  const generateAIInsights = () => {
    const insights: { type: 'success' | 'warning' | 'info'; message: string }[] = [];

    // Check for low participation
    const lowParticipation = studentParticipation.filter(s => s.evaluations < 2);
    if (lowParticipation.length > 0) {
      insights.push({
        type: 'warning',
        message: `${lowParticipation.length} student(s) have submitted fewer than 2 evaluations. Consider sending reminders: ${lowParticipation.slice(0, 3).map(s => s.name).join(', ')}${lowParticipation.length > 3 ? '...' : ''}`,
      });
    }

    // Check for outstanding evaluations
    const pendingReview = evaluations.filter(e => e.status === 'submitted').length;
    if (pendingReview > 5) {
      insights.push({
        type: 'info',
        message: `You have ${pendingReview} evaluations pending review. The AI grading assistant can help speed up the review process.`,
      });
    }

    // Criteria analysis
    const weakCriteria = criteriaData.filter(c => c.value < 3.5);
    if (weakCriteria.length > 0) {
      insights.push({
        type: 'warning',
        message: `Students are rating peers lower in ${weakCriteria.map(c => c.name).join(', ')}. Consider targeted skill-building activities in these areas.`,
      });
    }

    // High performers
    const topStudents = studentParticipation.filter(s => s.avgGrade >= 90 && s.evaluations >= 2);
    if (topStudents.length > 0) {
      insights.push({
        type: 'success',
        message: `${topStudents.length} student(s) consistently submit high-quality evaluations (90+ average). Consider highlighting ${topStudents[0].name} as an example.`,
      });
    }

    // Class comparison
    if (classPerformance.length > 1) {
      const topClass = classPerformance.reduce((prev, current) => 
        (prev.avgGrade > current.avgGrade) ? prev : current
      );
      const bottomClass = classPerformance.reduce((prev, current) => 
        (prev.avgGrade < current.avgGrade && prev.avgGrade > 0) ? prev : current
      );
      
      if (topClass.avgGrade - bottomClass.avgGrade > 10) {
        insights.push({
          type: 'info',
          message: `${topClass.class} shows significantly better evaluation quality than ${bottomClass.class}. Consider sharing best practices between classes.`,
        });
      }
    }

    // Assignment completion
    const activeAssignments = assignments.filter(a => a.status === 'active');
    if (activeAssignments.length > 0) {
      const overdueAssignments = activeAssignments.filter(a => 
        new Date(a.dueDate) < new Date()
      );
      if (overdueAssignments.length > 0) {
        insights.push({
          type: 'warning',
          message: `${overdueAssignments.length} assignment(s) are past due date. Consider extending the deadline or marking as completed.`,
        });
      }
    }

    return insights;
  };

  const aiInsights = generateAIInsights();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-800 mb-1">Analytics & Insights</h3>
        <p className="text-gray-600">AI-powered analytics to track student engagement and evaluation quality</p>
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No evaluation data available. Analytics will appear once students submit evaluations.</p>
        </div>
      ) : (
        <>
          {/* AI Insights Section */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-indigo-600" />
              <h3 className="text-indigo-900">AI-Powered Insights</h3>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => {
                const Icon = insight.type === 'success' ? CheckCircle : 
                           insight.type === 'warning' ? AlertTriangle : TrendingUp;
                const bgColor = insight.type === 'success' ? 'bg-green-50 border-green-200' :
                               insight.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                               'bg-blue-50 border-blue-200';
                const textColor = insight.type === 'success' ? 'text-green-800' :
                                 insight.type === 'warning' ? 'text-orange-800' :
                                 'text-blue-800';
                
                return (
                  <div key={index} className={`${bgColor} border p-4 rounded-lg`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${textColor} mt-0.5`} />
                      <p className={textColor}>{insight.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Participation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-gray-800 mb-4">Student Participation</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentParticipation.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="evaluations" fill="#6366f1" name="Evaluations Submitted" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Criteria Performance Radar */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-gray-800 mb-4">Average Criteria Scores</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={criteriaData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 5]} />
                  <Radar name="Average Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Class Performance Comparison */}
            {classPerformance.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-gray-800 mb-4">Class Performance Comparison</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="evaluations" fill="#8b5cf6" name="Evaluations" />
                    <Bar yAxisId="right" dataKey="avgGrade" fill="#22c55e" name="Avg Grade" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Evaluation Status Distribution */}
            {statusData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-gray-800 mb-4">Evaluation Status Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Student Quality Rankings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-gray-800 mb-4">Student Evaluation Quality</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 text-gray-700">Evaluations</th>
                    <th className="text-center py-3 px-4 text-gray-700">Avg Grade</th>
                    <th className="text-left py-3 px-4 text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentParticipation.map((student, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {index < 3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800">
                            {index + 1}
                          </span>
                        ) : (
                          <span className="text-gray-600">{index + 1}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">{student.name}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{student.evaluations}</td>
                      <td className="py-3 px-4 text-center">
                        {student.avgGrade > 0 ? (
                          <span className={`inline-block px-3 py-1 rounded-full ${
                            student.avgGrade >= 90 ? 'bg-green-100 text-green-800' :
                            student.avgGrade >= 80 ? 'bg-blue-100 text-blue-800' :
                            student.avgGrade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.avgGrade}%
                          </span>
                        ) : (
                          <span className="text-gray-400">Not graded</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {student.evaluations === 0 ? (
                          <span className="text-red-600">No submissions</span>
                        ) : student.evaluations < 2 ? (
                          <span className="text-orange-600">Low participation</span>
                        ) : student.avgGrade >= 85 ? (
                          <span className="text-green-600">Excellent</span>
                        ) : (
                          <span className="text-blue-600">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


