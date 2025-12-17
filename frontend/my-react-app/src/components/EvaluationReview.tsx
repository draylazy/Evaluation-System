import { useState } from 'react';
import { StudentEvaluation, Student, Assignment } from './TeacherDashboard';
import { CheckCircle, Eye, Sparkles, MessageSquare, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EvaluationReviewProps {
  evaluations: StudentEvaluation[];
  students: Student[];
  assignments: Assignment[];
  onGradeEvaluation: (evaluationId: string, grade: number, comments: string) => void;
}

export function EvaluationReview({
  evaluations,
  students,
  assignments,
  onGradeEvaluation,
}: EvaluationReviewProps) {
  const [selectedEvaluation, setSelectedEvaluation] = useState<StudentEvaluation | null>(null);
  const [gradeInput, setGradeInput] = useState(85);
  const [commentsInput, setCommentsInput] = useState('');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const getAssignmentTitle = (assignmentId: string) => {
    return assignments.find(a => a.id === assignmentId)?.title || 'Unknown Assignment';
  };

  const calculateAverage = (criteria: StudentEvaluation['criteria']) => {
    const values = Object.values(criteria);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const generateAIInsights = (evaluation: StudentEvaluation) => {
    setIsGeneratingAI(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const insights: string[] = [];
      const avg = parseFloat(calculateAverage(evaluation.criteria));
      
      // Quality analysis
      const strengthsLength = evaluation.strengths.length;
      const improvementsLength = evaluation.areasForImprovement.length;
      const hasSpecifics = 
        evaluation.strengths.toLowerCase().includes('example') ||
        evaluation.strengths.toLowerCase().includes('project') ||
        evaluation.strengths.toLowerCase().includes('when') ||
        evaluation.strengths.toLowerCase().includes('during');

      if (strengthsLength > 100 && improvementsLength > 80) {
        insights.push('✓ High Quality: This evaluation provides comprehensive and detailed feedback.');
      } else if (strengthsLength < 50 || improvementsLength < 50) {
        insights.push('⚠ Quality Concern: Feedback could be more detailed and specific.');
      }

      if (hasSpecifics) {
        insights.push('✓ Evidence-Based: The student provided concrete examples to support their evaluation.');
      } else {
        insights.push('⚠ Suggest Improvement: Encourage the student to include specific examples in future evaluations.');
      }

      // Rating consistency
      const criteriaValues = Object.values(evaluation.criteria);
      const variance = criteriaValues.reduce((sum, val) => {
        return sum + Math.pow(val - avg, 2);
      }, 0) / criteriaValues.length;

      if (variance < 0.5) {
        insights.push('⚠ Rating Pattern: All ratings are very similar. This might indicate insufficient differentiation.');
      }

      // Positivity analysis
      if (avg >= 4.5) {
        insights.push('✓ Positive Evaluation: High ratings detected. Ensure the strengths section justifies these scores.');
      } else if (avg <= 2.5) {
        insights.push('⚠ Low Ratings: Ensure feedback is constructive and provides actionable improvement suggestions.');
      }

      // Constructiveness check
      const hasActionable = 
        evaluation.areasForImprovement.toLowerCase().includes('could') ||
        evaluation.areasForImprovement.toLowerCase().includes('should') ||
        evaluation.areasForImprovement.toLowerCase().includes('try') ||
        evaluation.areasForImprovement.toLowerCase().includes('suggest');

      if (hasActionable) {
        insights.push('✓ Constructive Feedback: The evaluation provides actionable suggestions for improvement.');
      }

      // Suggested grade
      let suggestedGrade = 85;
      if (strengthsLength > 100 && improvementsLength > 80 && hasSpecifics) {
        suggestedGrade = 95;
        insights.push(`💡 AI Suggested Grade: ${suggestedGrade}/100 - Excellent evaluation with specific examples and comprehensive feedback.`);
      } else if (strengthsLength > 60 && improvementsLength > 60) {
        suggestedGrade = 88;
        insights.push(`💡 AI Suggested Grade: ${suggestedGrade}/100 - Good evaluation with adequate detail.`);
      } else if (strengthsLength < 50 || improvementsLength < 50) {
        suggestedGrade = 75;
        insights.push(`💡 AI Suggested Grade: ${suggestedGrade}/100 - Basic evaluation that could benefit from more detail.`);
      } else {
        insights.push(`💡 AI Suggested Grade: ${suggestedGrade}/100 - Satisfactory evaluation meeting minimum requirements.`);
      }

      setGradeInput(suggestedGrade);
      setAiInsights(insights);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const handleOpenEvaluation = (evaluation: StudentEvaluation) => {
    setSelectedEvaluation(evaluation);
    setGradeInput(evaluation.teacherGrade || 85);
    setCommentsInput(evaluation.teacherComments || '');
    setAiInsights([]);
  };

  const handleGrade = () => {
    if (selectedEvaluation) {
      onGradeEvaluation(selectedEvaluation.id, gradeInput, commentsInput);
      setSelectedEvaluation(null);
      setGradeInput(85);
      setCommentsInput('');
      setAiInsights([]);
    }
  };

  const getStatusColor = (status: StudentEvaluation['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
    }
  };

  const submittedEvals = evaluations.filter(e => e.status === 'submitted');
  const reviewedEvals = evaluations.filter(e => e.status === 'reviewed');
  const gradedEvals = evaluations.filter(e => e.status === 'graded');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-800 mb-1">Evaluation Review</h3>
        <p className="text-gray-600">Review and grade student peer evaluations with AI assistance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 mb-1">Pending Review</p>
              <p className="text-3xl text-blue-900">{submittedEvals.length}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 mb-1">In Review</p>
              <p className="text-3xl text-yellow-900">{reviewedEvals.length}</p>
            </div>
            <Eye className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 mb-1">Graded</p>
              <p className="text-3xl text-green-900">{gradedEvals.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
      </div>

      {/* Evaluations Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({evaluations.length})</TabsTrigger>
          <TabsTrigger value="submitted">Pending ({submittedEvals.length})</TabsTrigger>
          <TabsTrigger value="reviewed">In Review ({reviewedEvals.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedEvals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {evaluations.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500">No evaluations submitted yet.</p>
            </div>
          ) : (
            evaluations.map(evaluation => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                studentName={getStudentName(evaluation.studentId)}
                assignmentTitle={getAssignmentTitle(evaluation.assignmentId)}
                onOpen={() => handleOpenEvaluation(evaluation)}
                getStatusColor={getStatusColor}
                calculateAverage={calculateAverage}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-3 mt-4">
          {submittedEvals.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500">No pending evaluations.</p>
            </div>
          ) : (
            submittedEvals.map(evaluation => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                studentName={getStudentName(evaluation.studentId)}
                assignmentTitle={getAssignmentTitle(evaluation.assignmentId)}
                onOpen={() => handleOpenEvaluation(evaluation)}
                getStatusColor={getStatusColor}
                calculateAverage={calculateAverage}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-3 mt-4">
          {reviewedEvals.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500">No evaluations in review.</p>
            </div>
          ) : (
            reviewedEvals.map(evaluation => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                studentName={getStudentName(evaluation.studentId)}
                assignmentTitle={getAssignmentTitle(evaluation.assignmentId)}
                onOpen={() => handleOpenEvaluation(evaluation)}
                getStatusColor={getStatusColor}
                calculateAverage={calculateAverage}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-3 mt-4">
          {gradedEvals.length === 0 ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500">No graded evaluations yet.</p>
            </div>
          ) : (
            gradedEvals.map(evaluation => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                studentName={getStudentName(evaluation.studentId)}
                assignmentTitle={getAssignmentTitle(evaluation.assignmentId)}
                onOpen={() => handleOpenEvaluation(evaluation)}
                getStatusColor={getStatusColor}
                calculateAverage={calculateAverage}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedEvaluation} onOpenChange={() => setSelectedEvaluation(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Evaluation</DialogTitle>
          </DialogHeader>
          {selectedEvaluation && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Student</p>
                    <p className="text-gray-900">{getStudentName(selectedEvaluation.studentId)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assignment</p>
                    <p className="text-gray-900">{getAssignmentTitle(selectedEvaluation.assignmentId)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Peer Evaluated</p>
                    <p className="text-gray-900">{selectedEvaluation.peerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Submitted</p>
                    <p className="text-gray-900">{new Date(selectedEvaluation.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Criteria Ratings */}
              <div>
                <h4 className="text-gray-800 mb-3">Rating Criteria (Avg: {calculateAverage(selectedEvaluation.criteria)}/5)</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedEvaluation.criteria).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-indigo-600">{value}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h4 className="text-gray-800 mb-2">Strengths</h4>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedEvaluation.strengths}</p>
                  <p className="text-gray-500 mt-2">{selectedEvaluation.strengths.length} characters</p>
                </div>
              </div>

              <div>
                <h4 className="text-gray-800 mb-2">Areas for Improvement</h4>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedEvaluation.areasForImprovement}</p>
                  <p className="text-gray-500 mt-2">{selectedEvaluation.areasForImprovement.length} characters</p>
                </div>
              </div>

              {selectedEvaluation.additionalComments && (
                <div>
                  <h4 className="text-gray-800 mb-2">Additional Comments</h4>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedEvaluation.additionalComments}</p>
                  </div>
                </div>
              )}

              {/* AI Insights */}
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-indigo-900">AI Quality Assessment</h4>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => generateAIInsights(selectedEvaluation)}
                    disabled={isGeneratingAI}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isGeneratingAI ? 'Analyzing...' : 'Generate AI Insights'}
                  </Button>
                </div>
                {aiInsights.length > 0 && (
                  <div className="space-y-2">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="bg-white p-3 rounded-md border border-indigo-200">
                        <p className="text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                )}
                {aiInsights.length === 0 && !isGeneratingAI && (
                  <p className="text-indigo-700">Click "Generate AI Insights" to receive intelligent analysis of this evaluation's quality.</p>
                )}
              </div>

              {/* Grading Section */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h4 className="text-gray-800 mb-4">Grade Evaluation</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Grade (0-100): {gradeInput}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-gray-500 mt-1">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Teacher Comments</label>
                    <Textarea
                      value={commentsInput}
                      onChange={(e) => setCommentsInput(e.target.value)}
                      placeholder="Provide feedback to the student about their evaluation..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedEvaluation(null)}>
                  Cancel
                </Button>
                <Button onClick={handleGrade} className="bg-green-600 hover:bg-green-700">
                  <Award className="w-4 h-4 mr-2" />
                  Save Grade
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for evaluation cards
function EvaluationCard({
  evaluation,
  studentName,
  assignmentTitle,
  onOpen,
  getStatusColor,
  calculateAverage,
}: {
  evaluation: StudentEvaluation;
  studentName: string;
  assignmentTitle: string;
  onOpen: () => void;
  getStatusColor: (status: StudentEvaluation['status']) => string;
  calculateAverage: (criteria: StudentEvaluation['criteria']) => string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-gray-900">{studentName}</h4>
            <Badge className={getStatusColor(evaluation.status)}>
              {evaluation.status}
            </Badge>
            {evaluation.teacherGrade && (
              <Badge className="bg-purple-100 text-purple-800">
                Grade: {evaluation.teacherGrade}/100
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mb-2">{assignmentTitle}</p>
          <div className="flex gap-4 text-gray-600">
            <span>Peer: {evaluation.peerName}</span>
            <span>•</span>
            <span>Avg Rating: {calculateAverage(evaluation.criteria)}/5</span>
            <span>•</span>
            <span>{new Date(evaluation.date).toLocaleDateString()}</span>
          </div>
        </div>
        <Button size="sm" onClick={onOpen} className="bg-indigo-600 hover:bg-indigo-700">
          <Eye className="w-4 h-4 mr-2" />
          Review
        </Button>
      </div>
    </div>
  );
}


