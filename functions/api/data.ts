// Cloudflare Pages Functions - KV veritabanı sunucusu
// https://developers.cloudflare.com/pages/functions/

interface Env {
  SUPPLEMENT_KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const kv = context.env.SUPPLEMENT_KV;
  const url = new URL(context.request.url);
  const method = context.request.method;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (method === 'GET') {
      // KV'den tüm veriyi al
      const data = await kv.get('supplement_arena_data', 'text');
      if (!data) {
        return new Response(JSON.stringify({ error: 'No data found' }), {
          status: 404,
          headers: corsHeaders,
        });
      }
      return new Response(data, { headers: corsHeaders });
    }

    if (method === 'POST' || method === 'PUT') {
      // Veriyi KV'ye kaydet
      const body = await context.request.text();
      if (!body) {
        return new Response(JSON.stringify({ error: 'Body is required' }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      // JSON doğrulama
      try {
        JSON.parse(body);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      await kv.put('supplement_arena_data', body);
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    if (method === 'DELETE') {
      await kv.delete('supplement_arena_data');
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
