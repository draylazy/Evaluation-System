import { useState } from 'react';
import { Evaluation } from '../App';
import { Sparkles, Send } from 'lucide-react';

interface EvaluationFormProps {
  onSubmit: (evaluation: Evaluation) => void;
}

export function EvaluationForm({ onSubmit }: EvaluationFormProps) {
  const [evaluatorName, setEvaluatorName] = useState('');
  const [peerName, setPeerName] = useState('');
  const [criteria, setCriteria] = useState({
    teamwork: 3,
    communication: 3,
    technicalSkills: 3,
    problemSolving: 3,
    leadership: 3,
  });
  const [strengths, setStrengths] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const criteriaLabels = {
    teamwork: 'Teamwork & Collaboration',
    communication: 'Communication Skills',
    technicalSkills: 'Technical Skills',
    problemSolving: 'Problem Solving',
    leadership: 'Leadership & Initiative',
  };

  const handleCriteriaChange = (key: keyof typeof criteria, value: number) => {
    setCriteria({ ...criteria, [key]: value });
  };

  const generateAISuggestions = () => {
    setIsGeneratingAI(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestions: string[] = [];
      
      // AI suggestions based on form content
      if (strengths.length < 50) {
        suggestions.push('Consider providing more specific examples of strengths to make feedback more actionable');
      }
      
      if (areasForImprovement.length < 30) {
        suggestions.push('Adding concrete examples of areas for improvement helps the peer understand how to grow');
      }
      
      const avgScore = Object.values(criteria).reduce((a, b) => a + b, 0) / Object.values(criteria).length;
      if (avgScore >= 4.5) {
        suggestions.push('High ratings detected - consider highlighting what makes this peer exceptional');
      } else if (avgScore <= 2.5) {
        suggestions.push('Lower ratings should be accompanied by constructive feedback and support resources');
      }
      
      if (!strengths.toLowerCase().includes('example') && !strengths.toLowerCase().includes('project')) {
        suggestions.push('Try referencing specific projects or situations to illustrate your points');
      }
      
      if (additionalComments.length === 0) {
        suggestions.push('Additional comments can provide context that helps personalize the evaluation');
      }
      
      setAiSuggestions(suggestions);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const evaluation: Evaluation = {
      id: Date.now().toString(),
      evaluatorName,
      peerName,
      date: new Date().toISOString().split('T')[0],
      criteria,
      strengths,
      areasForImprovement,
      additionalComments,
      aiSuggestions: aiSuggestions.length > 0 ? aiSuggestions : undefined,
    };
    
    onSubmit(evaluation);
    
    // Reset form
    setEvaluatorName('');
    setPeerName('');
    setCriteria({
      teamwork: 3,
      communication: 3,
      technicalSkills: 3,
      problemSolving: 3,
      leadership: 3,
    });
    setStrengths('');
    setAreasForImprovement('');
    setAdditionalComments('');
    setAiSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-indigo-600 mb-4">Create New Evaluation</h2>
        <p className="text-gray-600 mb-6">Provide comprehensive feedback for your peer. AI will help ensure your feedback is constructive and actionable.</p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">Your Name</label>
          <input
            type="text"
            value={evaluatorName}
            onChange={(e) => setEvaluatorName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Peer's Name</label>
          <input
            type="text"
            value={peerName}
            onChange={(e) => setPeerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter peer's name"
            required
          />
        </div>
      </div>

      {/* Rating Criteria */}
      <div>
        <h3 className="text-gray-800 mb-4">Rating Criteria</h3>
        <div className="space-y-4">
          {Object.entries(criteriaLabels).map(([key, label]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700">{label}</label>
                <span className="text-indigo-600">{criteria[key as keyof typeof criteria]}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={criteria[key as keyof typeof criteria]}
                onChange={(e) => handleCriteriaChange(key as keyof typeof criteria, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-gray-500 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Text Feedback */}
      <div>
        <label className="block text-gray-700 mb-2">Strengths</label>
        <textarea
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Describe what this peer does well..."
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Areas for Improvement</label>
        <textarea
          value={areasForImprovement}
          onChange={(e) => setAreasForImprovement(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Constructive feedback on areas where this peer could grow..."
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Additional Comments (Optional)</label>
        <textarea
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Any other thoughts or context..."
        />
      </div>

      {/* AI Suggestions */}
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-indigo-900">AI Feedback Assistant</h3>
          </div>
          <button
            type="button"
            onClick={generateAISuggestions}
            disabled={isGeneratingAI}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isGeneratingAI ? 'Analyzing...' : 'Get AI Suggestions'}
          </button>
        </div>
        
        {aiSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-indigo-800 mb-2">AI Recommendations:</p>
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white p-3 rounded-md border border-indigo-200">
                <p className="text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        )}
        
        {aiSuggestions.length === 0 && !isGeneratingAI && (
          <p className="text-indigo-700">Click "Get AI Suggestions" to receive intelligent recommendations for improving your feedback.</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Send className="w-5 h-5" />
          Submit Evaluation
        </button>
      </div>
    </form>
  );
}
