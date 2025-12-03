import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import authService from '../services/authService';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!username || !password) {
            setError('Please enter username and password.');
            setLoading(false);
            return;
        }
        if (isRegister && !email) {
            setError('Please enter an email for registration.');
            setLoading(false);
            return;
        }

        try {
            if (isRegister) {
                await authService.register({ username, email, password, role });
                setIsRegister(false);
                setError('Registration successful. Please log in.');
                setUsername('');
                setPassword('');
                setEmail('');
            } else {
                const response = await authService.login({ username, password });
                onLogin(response.user);
            }
        } catch (err) {
            setError(err.message || 'Authenticationb failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center mb-4">
                        <GraduationCap className="w-12 h-12 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800 ml-2">Kastra SMS</h1>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{isRegister ? 'Create Account' : 'Welcome Back'}</p>
                </div>
               {error && (
          <div className={`${
            error.includes('successful') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
          } border px-4 py-3 rounded mb-4`}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            {isRegister 
              ? 'Already have an account? Login' 
              : 'Need an account? Register'}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Demo credentials: username: admin, password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;