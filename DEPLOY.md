# Deploy Kılavuzu - Cloudflare Pages + KV

## 1. Cloudflare Hesabı Oluştur
1. https://dash.cloudflare.com adresine git
2. Ücretsiz hesap oluştur

## 2. KV Namespace Oluştur
1. Dashboard > Workers & Pages > KV
2. "Create namespace" tıkla
3. İsim: `SUPPLEMENT_KV`
4. Oluştur

## 3. Pages Projesi Oluştur
1. Dashboard > Workers & Pages > Pages > "Connect to Git"
2. GitHub reposunu bağla
3. Framework: `None` (build komutu manuel)
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output:** `dist`
   - **Root directory:** `/`

## 4. KV Binding Ekle
1. Pages projesi > Settings > Functions > KV namespace bindings
2. "Add binding" tıkla
3. **Variable name:** `SUPPLEMENT_KV`
4. **KV namespace:** `SUPPLEMENT_KV` (yukarıda oluşturduğun)
5. Kaydet

## 5. İlk Seed (KV'ye başlangıç verisi yükleme)
Projenin local'de build alındıktan sonra:

```bash
# Cloudflare'a giriş yap
npx wrangler login

# Seed yap (dist'teki build'den)
npx wrangler kv:key put \
  --binding=SUPPLEMENT_KV \
  "supplement_arena_data" \
  "$(cat dist/seed-data.json)"
```

Not: Şu an seed-data.json oluşturmadık çünkü demoData ilk çalışmada otomatik yükleniyor.
KV'de veri yoksa, kullanıcılar siteye girdiğinde localStorage'a demoData yazılır.

## 6. Deploy
```bash
npx wrangler pages deploy dist --branch production
```

Veya GitHub'a push yapınca otomatik deploy olur (eğer Git bağlantısı yapıldıysa).

## 7. Güncelleme
Her GitHub push'u otomatik deploy eder (ücretsiz 500 build/ay).
Tüm veriler Cloudflare KV'de kalıcı olarak saklanır.
Kullanıcılar ve yorumlar asla kaybolmaz.

## Mimari
```
[Kullanıcı Tarayıcısı]
    ↓                        ↑
[localStorage] ←senkronize→ [Cloudflare KV]
                               ↑
                        [Pages Functions API]
                               ↑
                        [Cloudflare CDN]
```

- **localStorage:** Hızlı okuma/yazma, offline çalışma
- **Cloudflare KV:** Kalıcı bulut depolama (kullanıcılar, yorumlar, ürünler)
- **Senkronizasyon:** Her kayıtta 2 saniye debounce ile otomatik cloud'a yedeklenir
