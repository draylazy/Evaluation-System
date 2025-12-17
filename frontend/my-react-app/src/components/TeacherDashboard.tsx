import { useState, useEffect } from 'react';
import { StudentManagement } from './StudentManagement';
import { EvaluationReview } from './EvaluationReview';
import { TeacherAnalytics } from './TeacherAnalytics';
import { AssignmentManager } from './AssignmentManager';
import { Users, ClipboardCheck, BarChart3, BookOpen } from 'lucide-react';

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
  status: 'active' | 'completed' | 'draft';
  minEvaluations: number;
  createdAt: string;
}

export interface StudentEvaluation {
  id: string;
  assignmentId: string;
  studentId: string;
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
  status: 'submitted' | 'reviewed' | 'graded';
  teacherGrade?: number;
  teacherComments?: string;
}

type TeacherTabType = 'students' | 'assignments' | 'review' | 'analytics';

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<TeacherTabType>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [evaluations, setEvaluations] = useState<StudentEvaluation[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadedStudents = JSON.parse(localStorage.getItem('teacher_students') || '[]');
    const loadedAssignments = JSON.parse(localStorage.getItem('teacher_assignments') || '[]');
    const loadedEvaluations = JSON.parse(localStorage.getItem('teacher_evaluations') || '[]');

    // Initialize with sample data if empty
    if (loadedStudents.length === 0) {
      const sampleStudents: Student[] = [
        {
          id: '1',
          name: 'Michael Chen',
          email: 'michael.chen@school.edu',
          class: 'CS-101',
          enrollmentDate: '2024-09-01',
        },
        {
          id: '2',
          name: 'Emma Williams',
          email: 'emma.williams@school.edu',
          class: 'CS-101',
          enrollmentDate: '2024-09-01',
        },
        {
          id: '3',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@school.edu',
          class: 'CS-101',
          enrollmentDate: '2024-09-01',
        },
        {
          id: '4',
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@school.edu',
          class: 'CS-102',
          enrollmentDate: '2024-09-01',
        },
        {
          id: '5',
          name: 'Jamie Park',
          email: 'jamie.park@school.edu',
          class: 'CS-102',
          enrollmentDate: '2024-09-01',
        },
      ];
      setStudents(sampleStudents);
      localStorage.setItem('teacher_students', JSON.stringify(sampleStudents));
    } else {
      setStudents(loadedStudents);
    }

    if (loadedAssignments.length === 0) {
      const sampleAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Mid-Semester Team Project Evaluation',
          description: 'Evaluate your team members on their contributions to the group project',
          dueDate: '2025-12-20',
          class: 'CS-101',
          status: 'active',
          minEvaluations: 3,
          createdAt: '2025-11-15',
        },
        {
          id: '2',
          title: 'End of Semester Peer Review',
          description: 'Comprehensive evaluation of peer collaboration throughout the semester',
          dueDate: '2025-12-31',
          class: 'CS-102',
          status: 'active',
          minEvaluations: 2,
          createdAt: '2025-11-20',
        },
      ];
      setAssignments(sampleAssignments);
      localStorage.setItem('teacher_assignments', JSON.stringify(sampleAssignments));
    } else {
      setAssignments(loadedAssignments);
    }

    if (loadedEvaluations.length === 0) {
      const sampleEvaluations: StudentEvaluation[] = [
        {
          id: '1',
          assignmentId: '1',
          studentId: '1',
          evaluatorName: 'Michael Chen',
          peerName: 'Emma Williams',
          date: '2025-12-10',
          criteria: {
            teamwork: 5,
            communication: 4,
            technicalSkills: 5,
            problemSolving: 4,
            leadership: 5,
          },
          strengths: 'Excellent technical skills and leadership. Emma consistently guides the team through complex problems.',
          areasForImprovement: 'Could improve on delegating tasks to team members.',
          additionalComments: 'Great team player overall.',
          status: 'submitted',
        },
        {
          id: '2',
          assignmentId: '1',
          studentId: '3',
          evaluatorName: 'Sarah Johnson',
          peerName: 'Michael Chen',
          date: '2025-12-10',
          criteria: {
            teamwork: 4,
            communication: 5,
            technicalSkills: 4,
            problemSolving: 5,
            leadership: 4,
          },
          strengths: 'Outstanding problem-solving abilities and communication skills.',
          areasForImprovement: 'Could take on more leadership responsibilities.',
          additionalComments: 'Very reliable team member.',
          status: 'reviewed',
          teacherGrade: 95,
          teacherComments: 'Well-written evaluation with specific examples.',
        },
      ];
      setEvaluations(sampleEvaluations);
      localStorage.setItem('teacher_evaluations', JSON.stringify(sampleEvaluations));
    } else {
      setEvaluations(loadedEvaluations);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('teacher_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('teacher_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('teacher_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedStudent } : s));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleAddAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment = {
      ...assignment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleUpdateAssignment = (id: string, updatedAssignment: Partial<Assignment>) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, ...updatedAssignment } : a));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleGradeEvaluation = (evaluationId: string, grade: number, comments: string) => {
    setEvaluations(evaluations.map(e =>
      e.id === evaluationId
        ? { ...e, status: 'graded', teacherGrade: grade, teacherComments: comments }
        : e
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-indigo-600 mb-2">Teacher Dashboard</h2>
        <p className="text-gray-600">Manage students, assignments, and review peer evaluations with AI assistance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Students</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Assignments</span>
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'review'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            <span>Review</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'students' && (
          <StudentManagement
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
        {activeTab === 'assignments' && (
          <AssignmentManager
            assignments={assignments}
            students={students}
            evaluations={evaluations}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )}
        {activeTab === 'review' && (
          <EvaluationReview
            evaluations={evaluations}
            students={students}
            assignments={assignments}
            onGradeEvaluation={handleGradeEvaluation}
          />
        )}
        {activeTab === 'analytics' && (
          <TeacherAnalytics
            students={students}
            assignments={assignments}
            evaluations={evaluations}
          />
        )}
      </div>
    </div>
  );
}


