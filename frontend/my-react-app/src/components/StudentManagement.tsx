import { useState } from 'react';
import { Student } from './TeacherDashboard';
import { UserPlus, Edit2, Trash2, Mail, Calendar, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, student: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentManagement({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}: StudentManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    } else {
      onAddStudent(formData);
      setIsAddDialogOpen(false);
    }
    setFormData({
      name: '',
      email: '',
      class: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      class: student.class,
      enrollmentDate: student.enrollmentDate,
    });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      class: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });
  };

  // Get unique classes
  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-800 mb-1">Student Management</h3>
          <p className="text-gray-600">Manage your students and class rosters</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@school.edu"
                  required
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="e.g., CS-101"
                  required
                />
              </div>
              <div>
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Add Student
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-blue-100">Total Students</p>
              <p className="text-2xl">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-purple-100">Total Classes</p>
              <p className="text-2xl">{classes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-green-100">Avg. Class Size</p>
              <p className="text-2xl">{classes.length > 0 ? Math.round(students.length / classes.length) : 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {classes.map(className => {
          const classStudents = students.filter(s => s.class === className);
          return (
            <div key={className} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100">
                <h4 className="text-indigo-900">{className}</h4>
                <p className="text-indigo-600">{classStudents.length} students</p>
              </div>
              <div className="divide-y divide-gray-200">
                {classStudents.map(student => (
                  <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                    {editingStudent?.id === student.id ? (
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Student Name"
                            required
                          />
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Email"
                            required
                          />
                          <Input
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            placeholder="Class"
                            required
                          />
                          <Input
                            type="date"
                            value={formData.enrollmentDate}
                            onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            Save
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-1">
                          <p className="text-gray-900">{student.name}</p>
                          <div className="flex flex-wrap gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {classes.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">No students added yet. Click "Add Student" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}


