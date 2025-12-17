import { useState } from 'react';
import { Evaluation } from '../App';
import { Calendar, User, TrendingUp, TrendingDown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface EvaluationListProps {
  evaluations: Evaluation[];
}

export function EvaluationList({ evaluations }: EvaluationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPeer, setFilterPeer] = useState<string>('');

  const uniquePeers = Array.from(new Set(evaluations.map(e => e.peerName)));

  const filteredEvaluations = filterPeer
    ? evaluations.filter(e => e.peerName === filterPeer)
    : evaluations;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getAverageScore = (criteria: Evaluation['criteria']) => {
    const values = Object.values(criteria);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-blue-600 bg-blue-100';
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-indigo-600 mb-2">Evaluation History</h2>
        <p className="text-gray-600">View and analyze all submitted peer evaluations</p>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <label className="text-gray-700">Filter by peer:</label>
        <select
          value={filterPeer}
          onChange={(e) => setFilterPeer(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Peers</option>
          {uniquePeers.map(peer => (
            <option key={peer} value={peer}>{peer}</option>
          ))}
        </select>
        {filterPeer && (
          <button
            onClick={() => setFilterPeer('')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Evaluations List */}
      {filteredEvaluations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No evaluations found. Create your first evaluation to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvaluations.map((evaluation) => {
            const avgScore = parseFloat(getAverageScore(evaluation.criteria));
            const isExpanded = expandedId === evaluation.id;

            return (
              <div
                key={evaluation.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div
                  className="bg-gray-50 p-4 cursor-pointer"
                  onClick={() => toggleExpand(evaluation.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-800">{evaluation.peerName}</h3>
                        <span className={`px-3 py-1 rounded-full ${getScoreColor(avgScore)}`}>
                          {avgScore}/5.0
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>by {evaluation.evaluatorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(evaluation.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Card Content */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Criteria Breakdown */}
                    <div>
                      <h4 className="text-gray-800 mb-3">Rating Breakdown</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(evaluation.criteria).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-indigo-600">{value}/5</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${(value / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h4 className="text-gray-800">Strengths</h4>
                      </div>
                      <p className="text-gray-700 bg-green-50 p-4 rounded-lg">{evaluation.strengths}</p>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-orange-600" />
                        <h4 className="text-gray-800">Areas for Improvement</h4>
                      </div>
                      <p className="text-gray-700 bg-orange-50 p-4 rounded-lg">{evaluation.areasForImprovement}</p>
                    </div>

                    {/* Additional Comments */}
                    {evaluation.additionalComments && (
                      <div>
                        <h4 className="text-gray-800 mb-2">Additional Comments</h4>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{evaluation.additionalComments}</p>
                      </div>
                    )}

                    {/* AI Suggestions */}
                    {evaluation.aiSuggestions && evaluation.aiSuggestions.length > 0 && (
                      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                          <h4 className="text-indigo-900">AI Insights</h4>
                        </div>
                        <div className="space-y-2">
                          {evaluation.aiSuggestions.map((suggestion, index) => (
                            <div key={index} className="bg-white p-3 rounded-md text-gray-700">
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


