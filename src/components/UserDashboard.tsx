import { useState } from 'react';
import { User } from '../types';

interface UserDashboardProps {
  user: User;
  allUsers: User[];
  onUpdateUser: (updatedUser: User) => void;
  onDeleteAccount: (userId: string) => void;
  onPromoteToAdmin: (userId: string) => void;
  onLogout: () => void;
  onClose?: () => void;
}

export const UserDashboard = ({
  user,
  allUsers,
  onUpdateUser,
  onDeleteAccount,
  onPromoteToAdmin,
  onLogout,
  onClose,
}: UserDashboardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );



  const handleUpdateProfile = () => {
    if (!name || !email) {
      setMessage({ type: 'error', text: 'İsim ve email alanları zorunludur.' });
      return;
    }

    const updatedUser = { ...user, name, email };
    onUpdateUser(updatedUser);
    setIsEditing(false);
    setMessage({ type: 'success', text: 'Profiliniz başarıyla güncellendi.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage({ type: 'error', text: 'Tüm şifre alanlarını doldurun.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' });
      return;
    }

    // Şimdilik sadece simüle ediyoruz
    setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAccountConfirm = () => {
    if (
      window.confirm(
        'Hesabınızı silmek istediğinizden EMİN MİSİNİZ? Bu işlem geri alınamaz!'
      )
    ) {
      onDeleteAccount(user.id);
    }
  };

  const otherUsers = allUsers.filter((u) => u.id !== user.id);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div
            className={`inline-block mt-3 px-3 py-1 text-xs font-bold rounded-full ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {user.role === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}
          </div>
        </div>
        <div className="flex gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 font-medium"
            >
              ← Siteye Dön
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-xs border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50 font-medium"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 mb-4 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profil Düzenleme */}
      <div className="border border-gray-200 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Profil Bilgilerim</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-medium"
          >
            {isEditing ? 'İptal' : 'Düzenle'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-4 py-2.5"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="bg-brand text-white px-6 py-2 text-sm font-bold rounded hover:bg-red-700"
            >
              Profili Güncelle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 text-xs">Ad Soyad</div>
              <div className="font-medium">{user.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">E-posta</div>
              <div className="font-medium">{user.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Şifre Değiştirme */}
      <div className="border border-gray-200 rounded-lg p-5 mb-6">
        <h3 className="font-bold text-lg mb-4">Şifre Değiştir</h3>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Mevcut şifre"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded px-4 py-2.5 text-sm"
          />
          <input
            type="password"
            placeholder="Yeni şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded px-4 py-2.5 text-sm"
          />
          <input
            type="password"
            placeholder="Yeni şifreyi tekrar girin"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full border rounded px-4 py-2.5 text-sm"
          />
          <button
            onClick={handleChangePassword}
            className="bg-gray-900 text-white px-5 py-2 text-sm font-bold rounded hover:bg-black"
          >
            Şifreyi Değiştir
          </button>
        </div>
      </div>

      {/* Admin Paneli - Sadece Adminler Görür */}
      {user.role === 'admin' && (
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-5 mb-6">
          <h3 className="font-bold text-lg text-purple-900 mb-3 flex items-center gap-2">
            👑 Admin Kontrol Paneli
          </h3>
          <p className="text-purple-700 text-sm mb-4">
            Diğer kullanıcıları admin yetkisiyle yükseltebilirsiniz.
          </p>

          <div className="space-y-3">
            {otherUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between bg-white border border-purple-100 rounded p-3"
              >
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <div>
                  {u.role === 'admin' ? (
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded font-bold">
                      Zaten Admin
                    </span>
                  ) : (
                    <button
                      onClick={() => onPromoteToAdmin(u.id)}
                      className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded font-medium"
                    >
                      Admin Yap
                    </button>
                  )}
                </div>
              </div>
            ))}
            {otherUsers.length === 0 && (
              <p className="text-purple-600 text-center py-6 italic">
                Henüz başka üye yok.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hesap Silme */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleDeleteAccountConfirm}
          className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-2"
        >
          🗑️ Hesabımı Sil
        </button>
        <p className="text-[10px] text-gray-400 mt-1">
          Bu işlem geri alınamaz. Tüm verileriniz silinecektir.
        </p>
      </div>
    </div>
  );
};
