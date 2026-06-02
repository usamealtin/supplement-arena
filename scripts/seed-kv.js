// Bu script, Cloudflare KV'yi başlatmak için kullanılır.
// İlk deploy öncesi çalıştırılması gerekir.
console.log(`
╔════════════════════════════════════════════════╗
║  SUPPLEMENT ARENA - Cloudflare KV Setup       ║
╠════════════════════════════════════════════════╣
║                                                ║
║  İlk deploy için şu adımları izleyin:         ║
║                                                ║
║  1. Cloudflare Dashboard'a girin              ║
║  2. Workers & Pages -> KV -> Create KV         ║
║    Namespace: SUPPLEMENT_KV                    ║
║                                                ║
║  3. wrangler.toml oluşturun:                  ║
║    $ npx wrangler pages project create         ║
║    (veya Cloudflare Dashboard'dan)             ║
║                                                ║
║  4. KV'yi seed'lemek için:                    ║
║    npx wrangler kv:key put                     ║
║      --binding=SUPPLEMENT_KV                   ║
║      "supplement_arena_data"                   ║
║      "$(cat dist/seed-data.json)"              ║
║                                                ║
║  5. Deploy:                                    ║
║    npx wrangler pages deploy dist              ║
║                                                ║
║  VEYA tek komut (otomatik):                    ║
║    npm run deploy                              ║
║                                                ║
╚════════════════════════════════════════════════╝
`);
