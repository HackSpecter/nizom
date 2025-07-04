import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simple password check
    if (password === 'KhalidHack') {
      // Store login state in localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      
      // 1-second loading animation
      setTimeout(() => {
        navigate('/admin/dashboard');
        setIsLoading(false);
      }, 1000);
    } else {
      setError('Неверный пароль');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/70 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8 shadow-2xl shadow-yellow-400/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">Admin Panel</h1>
            <p className="text-gray-400">Войти в панель управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <label className="block text-yellow-400 font-semibold mb-3">
                Пароль:
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
            >
              ← Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;