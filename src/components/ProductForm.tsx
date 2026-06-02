import { useState } from 'react';
import { StarRating } from './StarRating';
import { getContentNameByCategory, parseTurkishNumber } from '../utils/helpers';

interface ProductFormProps {
  categoryList: string[];
  brandList: string[];
  onAddProduct: (product: any) => void;
  onSuggestProduct: (product: any) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export const ProductForm = ({
  categoryList,
  brandList,
  onAddProduct,
  onSuggestProduct,
  isLoggedIn,
  isAdmin,
}: ProductFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cat || !brand || !name || !url || !price || !servings || !grams || !contentGrams) {
      alert('Lütfen tüm gerekli alanları doldurun!');
      return;
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      alert(
        'Geçersiz URL! Lütfen geçerli bir web adresi girin. (Örnek: https://www.sitesi.com/urun)'
      );
      return;
    }

    const parsedPrice = parseTurkishNumber(price);
    const parsedServings = parseTurkishNumber(servings);
    const parsedGrams = parseTurkishNumber(grams);
    const parsedContentGrams = parseTurkishNumber(contentGrams);

    if (parsedPrice <= 0 || parsedServings <= 0 || parsedGrams <= 0 || parsedContentGrams <= 0) {
      alert('Lütfen fiyat, servis, gramaj ve ana içerik alanlarına geçerli pozitif sayılar girin!');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      category: cat,
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
      date: new Date().toISOString(),
    };

    if (isAdmin) {
      onAddProduct(newProduct);
      alert('Ürün sisteme eklendi!');
    } else if (isLoggedIn) {
      onSuggestProduct(newProduct);
      alert('Ürün önerisi gönderildi! Admin inceleyerek onaylanacak.');
    } else {
      alert('Ürün eklemek için önce üye girişi yapmalısınız!');
      return;
    }

    setCat('');
    setBrand('');
    setName('');
    setUrl('');
    setPrice('');
    setServings('');
    setGrams('');
    setContentGrams('');
    setCode('');
    setTaste(0);
    setSubmitted(true);
    setIsOpen(false);
    setTimeout(() => setSubmitted(false), 2000);
  };

  // Başlık metni - kullanıcı durumuna göre
  const ctaTitle = isAdmin
    ? 'Yeni Ürün Ekle (Admin)'
    : isLoggedIn
    ? 'Listemize katkı yapmak ister misin?'
    : 'Listemize katkı yapmak ister misin?';

  const ctaSubtitle = isAdmin
    ? 'Doğrudan sisteme ürün ekleyebilirsin.'
    : isLoggedIn
    ? 'Bulduğun bir ürünü önererek herkesin işine yarayalım.'
    : 'Üye olarak listemize yeni ürünler önerebilirsin.';

  return (
    <div className="bg-white shadow-sm border border-gray-200 mb-6 rounded overflow-hidden">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-brand bg-opacity-10 text-brand w-10 h-10 rounded flex items-center justify-center text-xl flex-shrink-0">
            ➕
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{ctaTitle}</h3>
            <p className="text-xs text-gray-500">{ctaSubtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {submitted && (
            <span className="text-green-600 text-xs font-bold animate-pulse">
              ✓ Gönderildi!
            </span>
          )}
          <span className="text-gray-400 text-sm">{isOpen ? '▲ Kapat' : '▼ Aç'}</span>
        </div>
      </button>

      {/* Collapsible Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-5 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Ürün / Paket Adı *
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="örn: Whey 3Matrix"
                className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
              />
            </div>

            <div className="md:col-span-3">
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
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Son Fiyat (₺) *
              </label>
              <input
                required
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="örn: 2.100 veya 2100,50"
                className="w-full border p-2 text-sm focus:border-brand outline-none rounded"
              />
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
                placeholder="örn: 71"
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
                placeholder="örn: 31"
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

            <div className="md:col-span-3 flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Kullanıcı Puanı (Opsiyonel)
                </label>
                <StarRating value={taste} editable onChange={setTaste} size={24} />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-gray-300 text-gray-700 font-bold uppercase px-4 py-2 text-sm hover:bg-gray-50 rounded"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="bg-brand text-white font-bold uppercase px-6 py-2 text-sm hover:opacity-90 rounded"
                >
                  {isAdmin ? '✓ Ekle' : isLoggedIn ? '📤 Öner' : '🔒 Giriş Gerekli'}
                </button>
              </div>
            </div>
          </div>

          {!isLoggedIn && (
            <p className="mt-3 text-[11px] text-gray-400 text-center">
              Öneri gönderebilmek için üye girişi yapmanız gerekir.
            </p>
          )}
        </form>
      )}
    </div>
  );
};
