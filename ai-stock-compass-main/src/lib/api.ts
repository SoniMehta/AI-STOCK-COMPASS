/**
 * API Client for AI Stock Compass Backend
 * Connects React frontend to FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => localStorage.getItem('auth_token');

// Get current user from localStorage
const getCurrentUserFromStorage = () => {
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

// API client with auth headers
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Authentication API
export const auth = {
  signup: async (data: { email: string; username: string; password: string; full_name?: string }) => {
    const response = await apiClient('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  },

  login: async (email: string, password: string) => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('auth_token', data.access_token);

    // Get user info and store it
    const user = await auth.getCurrentUser();
    localStorage.setItem('current_user', JSON.stringify(user));

    return data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  },

  getCurrentUser: async () => {
    return await apiClient('/auth/me');
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Stock operations API
export const stocks = {
  getQuote: async (ticker: string) => {
    return await apiClient(`/stocks/${ticker}/quote`);
  },

  getCandles: async (ticker: string, resolution = 'D', from: number, to: number) => {
    return await apiClient(`/stocks/${ticker}/candles?resolution=${resolution}&from=${from}&to=${to}`);
  },

  analyze: async (ticker: string, analysisType = 'full') => {
    return await apiClient('/stocks/analyze', {
      method: 'POST',
      body: JSON.stringify({ ticker, analysis_type: analysisType }),
    });
  },

  search: async (query: string) => {
    return await apiClient(`/stocks/search?q=${encodeURIComponent(query)}`);
  },

  getSimpleInsights: async (ticker: string) => {
    return await apiClient(`/stocks/${ticker}/simple-insights`);
  },
};

// Watchlist API
export const watchlist = {
  getAll: async () => {
    return await apiClient('/watchlist');
  },

  add: async (ticker: string) => {
    return await apiClient(`/watchlist/${ticker}`, { method: 'POST' });
  },

  remove: async (ticker: string) => {
    return await apiClient(`/watchlist/${ticker}`, { method: 'DELETE' });
  },
};

// History API
export const history = {
  getAll: async (limit = 50, offset = 0, ticker?: string) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (ticker) params.append('ticker', ticker);
    return await apiClient(`/history?${params}`);
  },

  getDetail: async (id: number) => {
    return await apiClient(`/history/${id}`);
  },
};

// News API
export const news = {
  getStockNews: async (ticker: string, daysBack = 7, maxArticles = 20) => {
    return await apiClient(`/news/stock/${ticker}?days_back=${daysBack}&max_articles=${maxArticles}`);
  },

  getMarketNews: async (maxArticles = 20) => {
    return await apiClient(`/news/market?max_articles=${maxArticles}`);
  },
};

// Beginner Guide API
export const beginnerGuide = {
  ask: async (question: string, ticker?: string) => {
    return await apiClient('/beginner/guide', {
      method: 'POST',
      body: JSON.stringify({ question, ticker }),
    });
  },

  chat: async (message: string) => {
    return await apiClient('/beginner/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  getTopics: async () => {
    return await apiClient('/beginner/topics');
  },
};

// Export default API object
export default {
  auth,
  stocks,
  watchlist,
  history,
  news,
  beginnerGuide,
};
