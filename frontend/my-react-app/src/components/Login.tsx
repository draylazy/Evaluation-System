import { useState } from 'react';
import { LogIn, UserCircle, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (
    email: string,
    name: string,
    role: 'student' | 'teacher' | 'admin'
  ) => void;
  onSwitchToSignup: () => void;
}

export function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('peereval_users') || '[]');
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      onLogin(user.email, user.name, user.role || 'student');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4'>
            <UserCircle className='w-10 h-10 text-white' />
          </div>
          <h1 className='text-indigo-600 mb-2'>Welcome Back</h1>
          <p className='text-gray-600'>
            Sign in to access Peer Evaluation with AI
          </p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-lg shadow-xl p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
                {error}
              </div>
            )}

            <div>
              <label className='block text-gray-700 mb-2'>Email Address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  placeholder='you@example.com'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-700 mb-2'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  placeholder='••••••••'
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg'
            >
              <LogIn className='w-5 h-5' />
              Sign In
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className='text-indigo-600 hover:text-indigo-800'
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
