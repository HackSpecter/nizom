import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Download, 
  Calendar, 
  Users, 
  Filter, 
  Eye, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Phone,
  LogOut,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Submission = Database['public']['Tables']['submissions']['Row'];

interface AdminFilters {
  startDate: string;
  endDate: string;
  searchTerm: string;
  status: string;
}

const AdminPanel: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdminFilters>({
    startDate: '',
    endDate: '',
    searchTerm: '',
    status: ''
  });
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  // Load submissions from Supabase
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      console.log('Loading submissions from Supabase...');
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Loaded submissions:', data);
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      // Show error to user
      alert('Ошибка загрузки данных из базы. Проверьте подключение к Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      const submissionDate = new Date(submission.created_at);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      const dateMatch = (!startDate || submissionDate >= startDate) && 
                       (!endDate || submissionDate <= endDate);
      
      const searchMatch = !filters.searchTerm || 
        submission.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        submission.contact.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        submission.instagram.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const statusMatch = !filters.status || submission.status === filters.status;

      return dateMatch && searchMatch && statusMatch;
    });
  }, [submissions, filters]);

  const updateSubmissionStatus = async (id: string, status: Submission['status'], notes?: string) => {
    setIsUpdating(true);
    try {
      console.log('Updating submission:', id, status, notes);
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status, 
          notes: notes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      await loadSubmissions();
      setEditingSubmission(null);
      alert('Статус успешно обновлен!');
    } catch (error) {
      console.error('Error updating submission:', error);
      alert('Ошибка обновления статуса');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;
    
    setIsUpdating(true);
    try {
      console.log('Deleting submission:', id);
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      await loadSubmissions();
      setSelectedSubmission(null);
      alert('Заявка успешно удалена!');
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Ошибка удаления заявки');
    } finally {
      setIsUpdating(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Contact', 'Instagram', 'Expectations', 'Status', 'Notes', 'Created Date', 'Updated Date'];
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(sub => [
        `"${sub.name}"`,
        `"${sub.contact}"`,
        `"${sub.instagram}"`,
        `"${sub.expectations.replace(/"/g, '""')}"`,
        `"${sub.status}"`,
        `"${sub.notes.replace(/"/g, '""')}"`,
        `"${new Date(sub.created_at).toLocaleString()}"`,
        `"${new Date(sub.updated_at).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instabarakat-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      case 'contacted': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'В ожидании';
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'contacted': return 'Связались';
      default: return status;
    }
  };

  // Edit Modal
  if (editingSubmission) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setEditingSubmission(null)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
            <h1 className="text-3xl font-bold text-yellow-400">Редактировать заявку</h1>
          </div>

          <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-8">
            <div className="grid gap-6">
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Ном ва насаб:</label>
                <p className="text-white text-lg">{editingSubmission.name}</p>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Номери телефон:</label>
                <p className="text-white text-lg">{editingSubmission.contact}</p>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Даромад:</label>
                <a 
                  href={editingSubmission.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-lg underline"
                >
                  {editingSubmission.instagram}
                </a>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Аз курс чӣ интизор доред?</label>
                <p className="text-white text-lg leading-relaxed">{editingSubmission.expectations}</p>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Статус:</label>
                <div className="flex gap-2 mb-4">
                  {['pending', 'approved', 'rejected', 'contacted'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateSubmissionStatus(editingSubmission.id, status as Submission['status'])}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        editingSubmission.status === status 
                          ? getStatusColor(status) 
                          : 'text-gray-400 bg-gray-700 hover:bg-gray-600'
                      } disabled:opacity-50`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Заметки:</label>
                <textarea
                  value={editingSubmission.notes}
                  onChange={(e) => setEditingSubmission({...editingSubmission, notes: e.target.value})}
                  className="w-full p-4 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                  rows={4}
                  placeholder="Добавить заметки..."
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => updateSubmissionStatus(editingSubmission.id, editingSubmission.status, editingSubmission.notes)}
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isUpdating ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  onClick={() => deleteSubmission(editingSubmission.id)}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  if (selectedSubmission) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к списку
            </button>
            <h1 className="text-3xl font-bold text-yellow-400">Детали заявки</h1>
          </div>

          <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-8">
            <div className="grid gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedSubmission.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubmission.status)}`}>
                    {getStatusText(selectedSubmission.status)}
                  </span>
                </div>
                <button
                  onClick={() => setEditingSubmission(selectedSubmission)}
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Редактировать
                </button>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Номери телефон:</label>
                <p className="text-white text-lg">{selectedSubmission.contact}</p>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Даромад:</label>
                <a 
                  href={selectedSubmission.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-lg underline"
                >
                  {selectedSubmission.instagram}
                </a>
              </div>
              
              <div>
                <label className="block text-yellow-400 font-semibold mb-2">Аз курс чӣ интизор доред?</label>
                <p className="text-white text-lg leading-relaxed">{selectedSubmission.expectations}</p>
              </div>
              
              {selectedSubmission.notes && (
                <div>
                  <label className="block text-yellow-400 font-semibold mb-2">Заметки:</label>
                  <p className="text-gray-300 text-lg leading-relaxed">{selectedSubmission.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <label className="block text-yellow-400 font-semibold mb-1">Дата подачи:</label>
                  <p>{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-yellow-400 font-semibold mb-1">Последнее обновление:</label>
                  <p>{new Date(selectedSubmission.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              На главную
            </button>
            <h1 className="text-3xl font-bold text-yellow-400">Instabarakat Admin Panel</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={loadSubmissions}
              disabled={loading}
              className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-5 h-5" />
              <span>{filteredSubmissions.length} заявок</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Выйти
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Всего заявок', value: submissions.length, color: 'yellow' },
            { label: 'В ожидании', value: submissions.filter(s => s.status === 'pending').length, color: 'yellow' },
            { label: 'Одобрено', value: submissions.filter(s => s.status === 'approved').length, color: 'green' },
            { label: 'Связались', value: submissions.filter(s => s.status === 'contacted').length, color: 'blue' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-6">
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-yellow-400">Фильтры</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Поиск:</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                  placeholder="Поиск по имени, контакту..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Статус:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full py-2 px-4 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              >
                <option value="">Все статусы</option>
                <option value="pending">В ожидании</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
                <option value="contacted">Связались</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">С даты:</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">По дату:</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={exportToCSV}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Экспорт CSV
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-gray-900 border border-yellow-400/30 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Загрузка заявок из базы данных...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-yellow-400/30">
  <tr>
    <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Ном ва насаб</th>
    <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Номери телефон</th>
    <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Даромад</th>
    <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Статус</th>
    <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Дата</th>
    <th className="text-left py-4 px-6 text-yellow-400 font-semibold">Действия</th>
  </tr>
</thead>

                <tbody>
                  {filteredSubmissions.map((submission, index) => (
                    <tr 
                      key={submission.id} 
                      className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-900'
                      }`}
                    >
                      <td className="py-4 px-6 text-white font-medium">{submission.name}</td>
                      <td className="py-4 px-6 text-gray-300">{submission.contact}</td>
                      <td className="py-4 px-6 text-gray-300">
                        {submission.instagram}    
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusText(submission.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Просмотр
                          </button>
                          <button
                            onClick={() => setEditingSubmission(submission)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                            Изменить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredSubmissions.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {submissions.length === 0 ? 'Заявки в базе данных не найдены' : 'Заявки не найдены по фильтрам'}
                  </p>
                  <p className="text-sm">
                    {submissions.length === 0 ? 'Проверьте подключение к Supabase' : 'Попробуйте изменить фильтры'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;