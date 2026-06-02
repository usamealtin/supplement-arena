
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  pendingCount: number;
  onShowDashboard?: () => void;
}

export const Header = ({
  user,
  categories,
  selectedCategory,
  onCategoryChange,
  onLogin,
  onLogout,
  pendingCount,
  onShowDashboard,
}: HeaderProps) => {
  return (
    <header className="bg-white border-b-4 border-brand sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-brand text-white font-bold text-2xl w-10 h-10 flex items-center justify-center rounded">
            S
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900 hidden sm:block">
            SUPPLEMENT ARENA
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && user?.role === 'admin' && (
            <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {pendingCount} Önerisi Beklemede
            </div>
          )}
          {user ? (
              <>
                <span className="text-xs font-bold uppercase text-gray-500 mr-2">
                  {user.role === 'admin' ? '👤 Admin:' : 'Hoş Geldin,'} {user.name}
                </span>
                <button
                  onClick={onShowDashboard}
                  className="border border-purple-300 text-purple-700 px-3 py-1 text-xs font-bold uppercase hover:bg-purple-50 mr-2"
                >
                  👤 Profil
                </button>
                <button
                  onClick={onLogout}
                  className="border border-gray-300 px-3 py-1 text-xs font-bold uppercase hover:bg-gray-50"
                >
                  Çıkış
                </button>
              </>
          ) : (
            <button
              onClick={onLogin}
              className="bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-black transition-colors"
            >
              Üye Girişi Yap
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3 hide-scrollbar border-t border-gray-100">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-4 py-2 text-xs font-bold uppercase whitespace-nowrap transition-colors rounded ${
              selectedCategory === ''
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tüm Kategoriler
          </button>
          {categories.map((c: string) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`px-4 py-2 text-xs font-bold uppercase whitespace-nowrap transition-colors rounded ${
                selectedCategory === c
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
