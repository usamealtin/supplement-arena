import { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (userData: { name: string; email: string; password: string }) => void;
  existingUsers: User[];
}

export const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  existingUsers,
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError('Bu email ile kayıtlı bir hesap bulunamadı.');
        setLoading(false);
        return;
      }

      // Şifre kontrolü simüle (gerçekte hash olurdu)
      if (password.length < 4) {
        setError('Şifre en az 4 karakter olmalıdır.');
        setLoading(false);
        return;
      }

      onLogin(user);
      resetForm();
      onClose();
      setLoading(false);
    }, 600);
  };

  const handleRegister = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır.');
        setLoading(false);
        return;
      }

      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        setError('Bu email adresi zaten kayıtlı.');
        setLoading(false);
        return;
      }

      onRegister({ name, email, password });
      resetForm();
      onClose();
      setLoading(false);
    }, 600);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex border-b">
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === 'login'
                ? 'border-b-2 border-brand text-brand'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all ${
              activeTab === 'register'
                ? 'border-b-2 border-brand text-brand'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Üye Ol
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-brand outline-none"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-brand outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full bg-brand text-white font-bold py-3.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>

              <div className="text-center text-xs text-gray-500 mt-4">
                Henüz üye değilsen{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-brand hover:underline font-medium"
                >
                  üye ol
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-brand outline-none"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-brand outline-none"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-brand outline-none"
                  placeholder="En az 6 karakter"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Şifreyi Tekrarla</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-brand outline-none"
                  placeholder="Şifreyi tekrar girin"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={
                  loading || !name || !email || !password || !confirmPassword
                }
                className="w-full bg-brand text-white font-bold py-3.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? 'Kayıt yapılıyor...' : 'Üye Ol'}
              </button>

              <div className="text-center text-xs text-gray-500 mt-4">
                Zaten üye misin?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-brand hover:underline font-medium"
                >
                  giriş yap
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
