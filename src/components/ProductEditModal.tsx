import { useState, useEffect } from 'react';
import { Product } from '../types';
import { StarRating } from './StarRating';
import { getContentNameByCategory, parseTurkishNumber } from '../utils/helpers';

interface ProductEditModalProps {
  isOpen: boolean;
  product: Product | null;
  categoryList: string[];
  brandList: string[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditModal = ({
  isOpen,
  product,
  categoryList,
  brandList,
  onClose,
  onSave,
}: ProductEditModalProps) => {
  const [cat, setCat] = useState('');
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [servings, setServings] = useState('');
  const [grams, setGrams] = useState('');
  const [contentGrams, setContentGrams] = useState('');
  const [code, setCode] = useState('');
  const [taste, setTaste] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setCat(product.category);
      setBrand(product.brand);
      setName(product.name);
      setUrl(product.url);
      setPrice(String(product.price));
      setServings(String(product.servings));
      setGrams(String(product.grams));
      setContentGrams(String(product.contentGrams || ''));
      setCode(product.code || '');
      setTaste(product.taste || 0);
      setError('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    setError('');

    if (!cat || !brand || !name || !url || !price || !servings || !grams || !contentGrams) {
      setError('Lütfen tüm gerekli alanları doldurun!');
      return;
    }

    // URL doğrulama
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError('Geçersiz URL! Lütfen geçerli bir web adresi girin. (Örnek: https://www.sitesi.com/urun)');
      return;
    }

    const parsedPrice = parseTurkishNumber(price);
    const parsedServings = parseTurkishNumber(servings);
    const parsedGrams = parseTurkishNumber(grams);
    const parsedContentGrams = parseTurkishNumber(contentGrams);

    if (parsedPrice <= 0 || parsedServings <= 0 || parsedGrams <= 0 || parsedContentGrams <= 0) {
      setError('Fiyat, servis, gramaj ve ana içerik alanlarına geçerli pozitif sayılar girin!');
      return;
    }

    onSave({
      ...product,
      category: cat.toLocaleUpperCase('tr-TR'),
      brand,
      name,
      url: normalizedUrl,
      price: parsedPrice,
      servings: Math.floor(parsedServings),
      grams: parsedGrams,
      contentName: getContentNameByCategory(cat),
      contentGrams: parsedContentGrams,
      code: code || null,
      taste: taste || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 uppercase">Ürünü Düzenle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded mb-4 text-sm font-bold">
            ⚠ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Kategori *
            </label>
            <select
              required
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded bg-white"
            >
              <option value="">-- Kategori Seçin --</option>
              {categoryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Marka *
            </label>
            <select
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded bg-white"
            >
              <option value="">-- Marka Seçin --</option>
              {brandList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Ürün / Paket Adı *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Ürün Linki (Satın Alma Sayfası) *
            </label>
            <input
              required
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="örn: https://www.sitesi.com/urun-adi"
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
            <p className="text-xs text-gray-400 mt-1">
              💡 "İncele" butonuna tıklandığında bu link açılacaktır.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Fiyat (₺) *
            </label>
            <input
              required
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="örn: 2.100 veya 2100,50"
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
            <p className="text-xs text-gray-400 mt-1">
              💡 Türkçe formatı destekler: "2.100,50" veya "2100.50"
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Toplam Servis *
            </label>
            <input
              required
              type="text"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              1 Servis Gramajı *
            </label>
            <input
              required
              type="text"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              {cat ? getContentNameByCategory(cat) : 'Ana İçerik'} (g / servis) *
            </label>
            <input
              required
              type="text"
              value={contentGrams}
              onChange={(e) => setContentGrams(e.target.value)}
              placeholder="örn: 24 veya 5,5"
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              İndirim Kodu
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="opsiyonel"
              className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
              Kullanıcı Puanı
            </label>
            <StarRating value={taste} editable onChange={setTaste} size={24} />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-brand text-white font-bold rounded hover:opacity-90"
          >
            💾 Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
