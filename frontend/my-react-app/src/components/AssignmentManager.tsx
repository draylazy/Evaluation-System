import { useState } from 'react';
import { Assignment, Student, StudentEvaluation } from './TeacherDashboard';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface AssignmentManagerProps {
  assignments: Assignment[];
  students: Student[];
  evaluations: StudentEvaluation[];
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  onDeleteAssignment: (id: string) => void;
}

export function AssignmentManager({
  assignments,
  students,
  evaluations,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}: AssignmentManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    class: '',
    status: 'draft' as 'active' | 'completed' | 'draft',
    minEvaluations: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAssignment(formData);
    setIsAddDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      class: '',
      status: 'draft',
      minEvaluations: 2,
    });
  };

  const getAssignmentStats = (assignment: Assignment) => {
    const assignmentEvals = evaluations.filter(e => e.assignmentId === assignment.id);
    const classStudents = students.filter(s => s.class === assignment.class);
    const expectedEvaluations = classStudents.length * assignment.minEvaluations;
    const submittedEvaluations = assignmentEvals.filter(e => e.status === 'submitted' || e.status === 'reviewed' || e.status === 'graded').length;
    const completionRate = expectedEvaluations > 0 ? Math.round((submittedEvaluations / expectedEvaluations) * 100) : 0;

    return {
      total: assignmentEvals.length,
      submitted: submittedEvaluations,
      reviewed: assignmentEvals.filter(e => e.status === 'reviewed').length,
      graded: assignmentEvals.filter(e => e.status === 'graded').length,
      expectedEvaluations,
      completionRate,
    };
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-800 mb-1">Assignment Management</h3>
          <p className="text-gray-600">Create and manage peer evaluation assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Mid-Semester Team Evaluation"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide instructions for students..."
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <select
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select class
                    </option>
                    {classes.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'completed' | 'draft',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="minEvaluations">Minimum Evaluations Required</Label>
                  <Input
                    id="minEvaluations"
                    type="number"
                    min="1"
                    value={formData.minEvaluations}
                    onChange={(e) => setFormData({ ...formData, minEvaluations: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Create Assignment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No assignments created yet. Click "Create Assignment" to get started.</p>
          </div>
        ) : (
          assignments.map(assignment => {
            const stats = getAssignmentStats(assignment);
            const daysUntilDue = Math.ceil(
              (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-gray-900">{assignment.title}</h4>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{assignment.description}</p>
                      <div className="flex flex-wrap gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          {daysUntilDue > 0 && daysUntilDue <= 7 && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800">
                              {daysUntilDue} days left
                            </Badge>
                          )}
                          {daysUntilDue < 0 && (
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          <span>Class: {assignment.class}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Min. Required: {assignment.minEvaluations} evaluations</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Could implement edit functionality here
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Completion Progress</span>
                      <span className="text-indigo-600">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl text-gray-900">{stats.expectedEvaluations}</p>
                        <p className="text-gray-600">Expected</p>
                      </div>
                      <div>
                        <p className="text-2xl text-blue-600">{stats.submitted}</p>
                        <p className="text-gray-600">Submitted</p>
                      </div>
                      <div>
                        <p className="text-2xl text-green-600">{stats.reviewed}</p>
                        <p className="text-gray-600">Reviewed</p>
                      </div>
                      <div>
                        <p className="text-2xl text-purple-600">{stats.graded}</p>
                        <p className="text-gray-600">Graded</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  {assignment.status === 'draft' && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        onClick={() => onUpdateAssignment(assignment.id, { status: 'active' })}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Activate Assignment
                      </Button>
                    </div>
                  )}
                  {assignment.status === 'active' && stats.completionRate === 100 && (
                    <div className="mt-4">
                      <Button
                        size="sm"
                        onClick={() => onUpdateAssignment(assignment.id, { status: 'completed' })}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Missing import
function GraduationCap({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      strokeWidth="2"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </svg>
  );
}
