// Módulo de integração com a API do GIPHY

export interface GiphyGif {
  id: string;
  title: string;
  url: string;        // GIF original de alta qualidade
  previewUrl: string; // GIF otimizado para o grid / pré-visualização rápida
  width: number;
  height: number;
}

const STORAGE_KEY = 'vibe_clube_giphy_api_key';
const RATING_KEY = 'vibe_clube_giphy_rating';

export const getGiphyApiKey = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (e) {
    console.warn('Erro ao ler chave do GIPHY do localStorage:', e);
  }
  return '';
};

export const setGiphyApiKey = (key: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch (e) {
    console.error('Erro ao salvar chave do GIPHY no localStorage:', e);
  }
};

export const hasGiphyApiKey = (): boolean => {
  return Boolean(getGiphyApiKey());
};

export const getGiphyRating = (): 'g' | 'pg' => {
  try {
    const saved = localStorage.getItem(RATING_KEY);
    if (saved === 'g' || saved === 'pg') {
      return saved;
    }
  } catch {
    // fallback padrão seguro
  }
  return 'g'; // Filtro de conteúdo adulto ligado por padrão (Livre / Família)
};

export const setGiphyRating = (rating: 'g' | 'pg'): void => {
  try {
    localStorage.setItem(RATING_KEY, rating);
  } catch {
    // ignore
  }
};

// GIFs em alta curados para uso imediato antes da configuração da chave ou offline
export const FALLBACK_TRENDING_GIFS: GiphyGif[] = [
  {
    id: 'fallback_1',
    title: 'Comemoração Festa Vibe',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/200.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_2',
    title: 'Dança da Vitória Happy',
    url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/blSTtZehjAZ8I/200.gif',
    width: 480,
    height: 360
  },
  {
    id: 'fallback_3',
    title: 'Gatinho vibe animado',
    url: 'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/200.gif',
    width: 480,
    height: 480
  },
  {
    id: 'fallback_4',
    title: 'Palmas e Aplausos Show',
    url: 'https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/200.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_5',
    title: 'Coração e Amor Romântico',
    url: 'https://media.giphy.com/media/26FLdmIp6wJr91JAI/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26FLdmIp6wJr91JAI/200.gif',
    width: 480,
    height: 360
  },
  {
    id: 'fallback_6',
    title: 'Fogo Hype Demais',
    url: 'https://media.giphy.com/media/QMHoU66sBXCAU/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/QMHoU66sBXCAU/200.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_7',
    title: 'Gamer Focado Vitória',
    url: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/13HgwGsXF0aiGY/200.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_8',
    title: 'Risada Engraçado Demais',
    url: 'https://media.giphy.com/media/Q7ozWVYCR0nyW2rvPW/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/Q7ozWVYCR0nyW2rvPW/200.gif',
    width: 480,
    height: 270
  },
  {
    id: 'fallback_9',
    title: 'Joinha Aprovado Legal',
    url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/111ebonMs90YLu/200.gif',
    width: 480,
    height: 360
  },
  {
    id: 'fallback_10',
    title: 'Uau Impressionado Shock',
    url: 'https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/5VKbvrjxpVJCM/200.gif',
    width: 480,
    height: 270
  }
];

export interface GiphyResult {
  gifs: GiphyGif[];
  totalCount: number;
  isFallback?: boolean;
}

/**
 * Busca GIFs em alta no GIPHY
 */
export const fetchTrendingGifs = async (
  offset = 0,
  limit = 20,
  rating: 'g' | 'pg' = getGiphyRating()
): Promise<GiphyResult> => {
  const apiKey = getGiphyApiKey();

  if (!apiKey) {
    // Retorna lista curada com indicação de fallback para exibir mensagem amigável
    return {
      gifs: FALLBACK_TRENDING_GIFS.slice(offset, offset + limit),
      totalCount: FALLBACK_TRENDING_GIFS.length,
      isFallback: true
    };
  }

  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(apiKey)}&limit=${limit}&offset=${offset}&rating=${rating}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('INVALID_KEY');
      }
      if (res.status === 429) {
        throw new Error('RATE_LIMIT');
      }
      throw new Error(`STATUS_${res.status}`);
    }

    const data = await res.json();
    const gifs: GiphyGif[] = (data.data || []).map((item: any) => ({
      id: item.id,
      title: item.title || 'GIF GIPHY',
      url: item.images?.original?.url || item.images?.downsized?.url || item.images?.fixed_height?.url,
      previewUrl: item.images?.fixed_height?.url || item.images?.fixed_width?.url || item.images?.preview_gif?.url || item.images?.original?.url,
      width: parseInt(item.images?.original?.width || '400', 10),
      height: parseInt(item.images?.original?.height || '300', 10)
    }));

    return {
      gifs,
      totalCount: data.pagination?.total_count || gifs.length
    };
  } catch (error: any) {
    if (error.message === 'INVALID_KEY' || error.message === 'RATE_LIMIT') {
      throw error;
    }
    console.warn('Erro ao chamar API do GIPHY:', error);
    // Em caso de falha de rede temporária, retorna fallback
    return {
      gifs: FALLBACK_TRENDING_GIFS.slice(offset, offset + limit),
      totalCount: FALLBACK_TRENDING_GIFS.length,
      isFallback: true
    };
  }
};

/**
 * Pesquisa GIFs por termo no GIPHY
 */
export const searchGifs = async (
  query: string,
  offset = 0,
  limit = 20,
  rating: 'g' | 'pg' = getGiphyRating()
): Promise<GiphyResult> => {
  const apiKey = getGiphyApiKey();

  if (!query.trim()) {
    return fetchTrendingGifs(offset, limit, rating);
  }

  if (!apiKey) {
    // Filtro simples local caso ainda não tenha chave
    const q = query.toLowerCase();
    const filtered = FALLBACK_TRENDING_GIFS.filter(g => g.title.toLowerCase().includes(q));
    return {
      gifs: filtered.slice(offset, offset + limit),
      totalCount: filtered.length,
      isFallback: true
    };
  }

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&rating=${rating}&lang=pt`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('INVALID_KEY');
      }
      if (res.status === 429) {
        throw new Error('RATE_LIMIT');
      }
      throw new Error(`STATUS_${res.status}`);
    }

    const data = await res.json();
    const gifs: GiphyGif[] = (data.data || []).map((item: any) => ({
      id: item.id,
      title: item.title || 'GIF GIPHY',
      url: item.images?.original?.url || item.images?.downsized?.url || item.images?.fixed_height?.url,
      previewUrl: item.images?.fixed_height?.url || item.images?.fixed_width?.url || item.images?.preview_gif?.url || item.images?.original?.url,
      width: parseInt(item.images?.original?.width || '400', 10),
      height: parseInt(item.images?.original?.height || '300', 10)
    }));

    return {
      gifs,
      totalCount: data.pagination?.total_count || gifs.length
    };
  } catch (error: any) {
    if (error.message === 'INVALID_KEY' || error.message === 'RATE_LIMIT') {
      throw error;
    }
    console.warn('Erro ao pesquisar no GIPHY:', error);
    throw error;
  }
};
