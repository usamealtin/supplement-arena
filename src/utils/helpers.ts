export function formatTRY(value: number, decimals = 2): string {
  return Number(value).toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Türkçe formatlı sayıları temizler: "1.234,56" -> 1234.56, "₺2.100" -> 2100
export function parseTurkishNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  // Boşluk, para birimi simgesi, nokta (binlik) ve TL/₺ gibi karakterleri kaldır
  let cleaned = String(value)
    .replace(/[₺$€£¥]/g, '')
    .replace(/\s/g, '')
    .replace(/TL/gi, '')
    .trim();

  // Türkçe format: binlik ayıracı nokta, ondalık ayıracı virgül
  // "1.234,56" -> "1234.56"
  // Eğer hem nokta hem virgül varsa: son virgül ondalıktır
  if (cleaned.includes(',') && cleaned.includes('.')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    // Sadece virgül var: ondalık ayıracıdır
    // Ama eğer virgülden sonra 3 hane varsa ve başka nokta yoksa binlik olabilir
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length === 3) {
      // Muhtemelen binlik ayıracı: "1,234" -> 1234
      cleaned = cleaned.replace(',', '');
    } else {
      // Ondalık: "12,5" -> 12.5
      cleaned = cleaned.replace(',', '.');
    }
  }
  // Sadece nokta varsa ve Türkçe'deyse binlik, İngilizce'de ondalık olabilir
  // Burada en güvenli yol: son noktadan sonra 2-3 hane varsa ondalık
  else if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3) {
      // "1.234" muhtemelen binlik (ör: telefon/ürün kodu)
      // Ama fiyat gibi duruyorsa, son karar: eğer başta 0 varsa veya sayı 1000'den büyükse binlik
      const num = parseFloat(cleaned);
      if (num >= 1000) {
        cleaned = cleaned.replace('.', '');
      }
    }
  }

  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
}

export function getContentNameByCategory(category: string): string {
  const normalized = category.toLocaleUpperCase('tr-TR');

  if (normalized.includes('PROTEİN') || normalized.includes('GAİNER')) return 'Protein';
  if (normalized.includes('KREAT')) return 'Kreatin';
  if (normalized.includes('BCAA')) return 'BCAA';
  if (normalized.includes('PRE-WORKOUT')) return 'Aktif İçerik';
  if (normalized.includes('OMEGA')) return 'Omega-3';
  if (normalized.includes('VİTAMİN') || normalized.includes('VITAMIN')) return 'Vitamin';
  if (normalized.includes('CARN')) return 'L-Carnitine';
  if (normalized.includes('GLUTAM')) return 'Glutamine';
  if (normalized.includes('TESTOSTERON')) return 'Aktif İçerik';

  return 'Ana İçerik';
}

export function getDefaultContentGrams(category: string, servingGrams: number): number {
  const normalized = category.toLocaleUpperCase('tr-TR');

  if (normalized.includes('PROTEİN')) return Math.min(24, servingGrams || 24);
  if (normalized.includes('KREAT')) return Math.min(5, servingGrams || 5);
  if (normalized.includes('BCAA')) return Math.min(7, servingGrams || 7);
  if (normalized.includes('GAİNER')) return Math.min(50, servingGrams || 50);
  if (normalized.includes('PRE-WORKOUT')) return Math.min(6, servingGrams || 6);
  if (normalized.includes('OMEGA')) return Math.min(1, servingGrams || 1);
  if (normalized.includes('VİTAMİN') || normalized.includes('VITAMIN')) return Math.min(1, servingGrams || 1);

  return servingGrams || 0;
}

export function rankProducts(
  products: any[],
  sortField: string,
  sortDir: 'asc' | 'desc'
) {
  const sorted = [...products].sort((a, b) => {
    let valA, valB;

    if (sortField === 'cost_per_gram') {
      valA = a.metrics.costPerGram;
      valB = b.metrics.costPerGram;
    } else if (sortField === 'cost_per_serving') {
      valA = a.metrics.costPerServing;
      valB = b.metrics.costPerServing;
    } else if (sortField === 'price') {
      valA = a.product.price;
      valB = b.product.price;
    } else {
      valA = a.tasteAvg;
      valB = b.tasteAvg;
    }

    if (valA === valB) return 0;
    if (sortDir === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  let currentRank = 1;
  let previousValue: any = null;

  return sorted.map((item, index) => {
    let val: any;
    if (sortField === 'cost_per_gram') val = item.metrics.costPerGram;
    else if (sortField === 'cost_per_serving') val = item.metrics.costPerServing;
    else if (sortField === 'price') val = item.product.price;
    else val = item.tasteAvg;

    if (index > 0 && val !== previousValue) {
      currentRank = index + 1;
    }
    previousValue = val;
    return { ...item, rank: currentRank };
  });
}

export const CATEGORY_INFO: Record<string, string> = {
  'PROTEİN TOZU':
    'Protein tozu, antrenman sonrası kas onarımını hızlandıran ve kas kütlesi artışını destekleyen temel bir takviyedir.',
  'KREATİN':
    'Kreatin, kas hücrelerinde enerji üretimini artırarak güç, dayanıklılık ve patlayıcı performansı maksimize eder.',
  'PRE-WORKOUT':
    'Antrenman öncesi (Pre-Workout) ürünleri; odaklanmayı, enerjiyi ve kaslara giden kan akışını artırmak için tasarlanmıştır.',
  'BCAA':
    'BCAA, kas yıkımını önlemeye ve antrenman sırasında dayanıklılığı artırmaya yardımcı olan amino asitleri içerir.',
  'GAİNER':
    'Karbonhidrat ve protein yoğunluklu gainer takviyeleri, yüksek kalori ihtiyacı olan sporcuların kütle kazanmasını kolaylaştırır.',
};
