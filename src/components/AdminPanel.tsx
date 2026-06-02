import { useState } from 'react';
import { PendingProduct } from '../types';
import { formatTRY } from '../utils/helpers';

interface AdminPanelProps {
  pendingProducts: PendingProduct[];
  categories: string[];
  brands: string[];
  onApprovePending: (id: string) => void;
  onRejectPending: (id: string) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddBrand: (brand: string) => void;
  onDeleteBrand: (brand: string) => void;
}

export const AdminPanel = ({
  pendingProducts,
  categories,
  brands,
  onApprovePending,
  onRejectPending,
  onAddCategory,
  onDeleteCategory,
  onAddBrand,
  onDeleteBrand,
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'categories' | 'brands'>('pending');
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    onAddCategory(newCategory.trim().toLocaleUpperCase('tr-TR'));
    setNewCategory('');
  };

  const handleAddBrand = () => {
    if (!newBrand.trim()) return;
    onAddBrand(newBrand.trim());
    setNewBrand('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden mb-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 px-4 text-sm font-bold uppercase transition-colors ${
            activeTab === 'pending'
              ? 'bg-brand text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          ⏳ Bekleyenler ({pendingProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-3 px-4 text-sm font-bold uppercase transition-colors ${
            activeTab === 'categories'
              ? 'bg-brand text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          📁 Kategoriler ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('brands')}
          className={`flex-1 py-3 px-4 text-sm font-bold uppercase transition-colors ${
            activeTab === 'brands'
              ? 'bg-brand text-white'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          🏷️ Markalar ({brands.length})
        </button>
      </div>

      {/* Pending Products Tab */}
      {activeTab === 'pending' && (
        <div>
          {pendingProducts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 font-bold">✓ Onay bekleyen ürün yok!</p>
            </div>
          ) : (
            <div className="divide-y">
              {pendingProducts.map((pending) => (
                <div key={pending.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-900">{pending.brand}</h4>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
                          {pending.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pending.name}</p>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs mb-2">
                        <div>
                          <span className="text-gray-500 font-bold">Fiyat:</span>
                          <br />
                          <span className="font-bold">{formatTRY(pending.price)} ₺</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold">Servis:</span>
                          <br />
                          <span className="font-bold">{pending.servings}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold">Gram:</span>
                          <br />
                          <span className="font-bold">{pending.grams}g</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold">Ana İçerik:</span>
                          <br />
                          <span className="font-bold">
                            {pending.contentName}: {pending.contentGrams || '-'}g
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-bold">Öneren:</span>
                          <br />
                          <span className="font-bold">{pending.suggestedBy}</span>
                        </div>
                      </div>

                      <a
                        href={pending.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand text-xs font-bold hover:underline"
                      >
                        🔗 Linki Aç
                      </a>
                    </div>

                    <div className="flex gap-2 md:flex-col">
                      <button
                        onClick={() => onApprovePending(pending.id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 text-sm font-bold uppercase hover:bg-green-600 rounded transition-colors"
                      >
                        ✓ Onayla
                      </button>
                      <button
                        onClick={() => onRejectPending(pending.id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 text-sm font-bold uppercase hover:bg-red-600 rounded transition-colors"
                      >
                        ✕ Reddet
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Yeni kategori adı..."
              className="flex-1 border border-gray-300 p-2 text-sm rounded focus:border-brand outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="bg-brand text-white px-4 py-2 text-sm font-bold uppercase hover:opacity-90 rounded"
            >
              + Ekle
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
              >
                <span className="font-bold text-gray-800">{cat}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`"${cat}" kategorisini silmek istediğinize emin misiniz?`)) {
                      onDeleteCategory(cat);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
                >
                  🗑️ Sil
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            💡 Kategoriler ürün eklerken seçim listesinde görünür.
          </p>
        </div>
      )}

      {/* Brands Tab */}
      {activeTab === 'brands' && (
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Yeni marka adı..."
              className="flex-1 border border-gray-300 p-2 text-sm rounded focus:border-brand outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleAddBrand()}
            />
            <button
              onClick={handleAddBrand}
              className="bg-brand text-white px-4 py-2 text-sm font-bold uppercase hover:opacity-90 rounded"
            >
              + Ekle
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
              >
                <span className="font-bold text-gray-800">{brand}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`"${brand}" markasını silmek istediğinize emin misiniz?`)) {
                      onDeleteBrand(brand);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
                >
                  🗑️ Sil
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            💡 Markalar ürün eklerken seçim listesinde görünür.
          </p>
        </div>
      )}
    </div>
  );
};
