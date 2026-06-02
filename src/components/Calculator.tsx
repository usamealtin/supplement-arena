import { useState } from 'react';
import { formatTRY, parseTurkishNumber } from '../utils/helpers';

interface CalcItem {
  id: string;
  name: string;
  price: string;
  servings: string;
  grams: string;
  contentGrams: string;
}

interface CalcResult {
  costPerServing: number;
  costPerGram: number;
  costPerContentGram: number;
  totalGrams: number;
  totalContent: number;
  isValid: boolean;
}

const createEmptyItem = (index: number): CalcItem => ({
  id: Date.now().toString() + '-' + index,
  name: '',
  price: '',
  servings: '',
  grams: '',
  contentGrams: '',
});

function computeResult(item: CalcItem): CalcResult {
  const p = parseTurkishNumber(item.price);
  const s = parseTurkishNumber(item.servings);
  const g = parseTurkishNumber(item.grams);
  const c = parseTurkishNumber(item.contentGrams);

  const isValid = p > 0 && s > 0 && g > 0 && c > 0;

  return {
    costPerServing: isValid ? p / s : 0,
    costPerGram: isValid ? p / (s * g) : 0,
    costPerContentGram: isValid ? p / (s * c) : 0,
    totalGrams: isValid ? s * g : 0,
    totalContent: isValid ? s * c : 0,
    isValid,
  };
}

export const Calculator = () => {
  const [items, setItems] = useState<CalcItem[]>([
    createEmptyItem(0),
    createEmptyItem(1),
  ]);

  const updateItem = (id: string, field: keyof CalcItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem(prev.length)]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setItems([createEmptyItem(0), createEmptyItem(1)]);
  };

  // Tüm sonuçları hesapla
  const results = items.map((item) => ({ item, result: computeResult(item) }));
  const validResults = results.filter((r) => r.result.isValid);

  // En iyi (en ucuz) değerleri bul
  const bestCostPerServing =
    validResults.length > 0
      ? Math.min(...validResults.map((r) => r.result.costPerServing))
      : 0;
  const bestCostPerGram =
    validResults.length > 0
      ? Math.min(...validResults.map((r) => r.result.costPerGram))
      : 0;
  const bestCostPerContentGram =
    validResults.filter((r) => r.result.costPerContentGram > 0).length > 0
      ? Math.min(
          ...validResults
            .filter((r) => r.result.costPerContentGram > 0)
            .map((r) => r.result.costPerContentGram)
        )
      : 0;

  return (
    <div className="bg-white p-5 shadow-sm border border-gray-200 mb-6 rounded">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-wide uppercase">
            🧮 Karşılaştırma Hesaplayıcısı
          </h3>
          <p className="text-xs text-gray-500">
            Birden fazla ürünü yan yana ekleyin, en iyi fiyat performansını anında görün.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="border border-gray-300 text-gray-700 text-xs font-bold uppercase px-3 py-2 rounded hover:bg-gray-50"
          >
            ↺ Sıfırla
          </button>
          <button
            type="button"
            onClick={addItem}
            className="bg-brand text-white text-xs font-bold uppercase px-3 py-2 rounded hover:opacity-90"
          >
            + Ürün Ekle
          </button>
        </div>
      </div>

      {/* Ürün kartları grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map(({ item, result }) => {
          const isWinnerServing =
            result.isValid &&
            result.costPerServing === bestCostPerServing &&
            validResults.length > 1;
          const isWinnerGram =
            result.isValid &&
            result.costPerGram === bestCostPerGram &&
            validResults.length > 1;
          const isWinnerContent =
            result.isValid &&
            result.costPerContentGram > 0 &&
            result.costPerContentGram === bestCostPerContentGram &&
            validResults.filter((r) => r.result.costPerContentGram > 0).length > 1;

          return (
            <div
              key={item.id}
              className={`border-2 rounded p-3 transition-all ${
                isWinnerGram
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Ürün"
                  className="font-bold text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand outline-none flex-1 mr-2"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 text-sm font-bold"
                    title="Bu ürünü kaldır"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">
                    Fiyat (₺)
                  </label>
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    placeholder="2.100"
                    className="w-full border border-gray-300 p-1.5 text-sm rounded focus:border-brand outline-none bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">
                      Servis
                    </label>
                    <input
                      type="text"
                      value={item.servings}
                      onChange={(e) => updateItem(item.id, 'servings', e.target.value)}
                      placeholder="71"
                      className="w-full border border-gray-300 p-1.5 text-sm rounded focus:border-brand outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">
                      1 Servis (g)
                    </label>
                    <input
                      type="text"
                      value={item.grams}
                      onChange={(e) => updateItem(item.id, 'grams', e.target.value)}
                      placeholder="31"
                      className="w-full border border-gray-300 p-1.5 text-sm rounded focus:border-brand outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">
                    Ana İçerik (g)
                  </label>
                  <input
                    type="text"
                    value={item.contentGrams}
                    onChange={(e) => updateItem(item.id, 'contentGrams', e.target.value)}
                    placeholder="24"
                    className="w-full border border-gray-300 p-1.5 text-sm rounded focus:border-brand outline-none bg-white"
                  />
                </div>
              </div>

              {/* Sonuçlar */}
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                {result.isValid ? (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-bold">1 Servis:</span>
                      <span
                        className={`font-bold ${
                          isWinnerServing ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {formatTRY(result.costPerServing)} ₺
                        {isWinnerServing && ' 🏆'}
                      </span>
                    </div>
                    {result.costPerContentGram > 0 && (
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200">
                        <span className="text-gray-500 font-bold">1g İçerik:</span>
                        <span
                          className={`font-bold text-sm ${
                            isWinnerContent ? 'text-green-600' : 'text-brand'
                          }`}
                        >
                          {formatTRY(result.costPerContentGram, 4)} ₺
                          {isWinnerContent && ' 🏆'}
                        </span>
                      </div>
                    )}
                    {result.totalContent > 0 && (
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed border-gray-200">
                        <span className="text-gray-500 font-bold">Toplam İçerik:</span>
                        <span className="font-bold text-gray-900">
                          {formatTRY(result.totalContent, 0)} g
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-[11px] text-gray-400 italic text-center py-2">
                    Hesaplamak için fiyat, servis, gramaj ve ana içerik girin.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Özet Banner */}
      {validResults.length >= 2 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3 text-sm">
          <div className="font-bold text-green-800 mb-1">🏆 En Avantajlı Ürün</div>
          <div className="text-xs text-green-700">
            <span className="font-bold">
              {
                validResults.find(
                  (r) => r.result.costPerGram === bestCostPerGram
                )?.item.name || 'Ürün'
              }
            </span>
            {' '}— 1 gram başına{' '}
            <span className="font-bold">{formatTRY(bestCostPerGram, 4)} ₺</span> ile en uygun
            fiyatlı seçenek.
            {bestCostPerContentGram > 0 && (
              <>
                {' '}Ana içerik bazında en iyisi:{' '}
                <span className="font-bold">
                  {
                    validResults.find(
                      (r) => r.result.costPerContentGram === bestCostPerContentGram
                    )?.item.name || 'Ürün'
                  }
                </span>{' '}
                (1g içerik = {formatTRY(bestCostPerContentGram, 4)} ₺)
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
