const API_URL = 'https://apicurso.bobinadosdumalek.es';

// Helper para hacer requests con autenticación
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  
  const text = await response.text();
  
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON:', text);
    return text;
  }
}

export const customApi = {
  auth: {
    register: async (data: { email: string; password: string; full_name: string }) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Error al registrarse');
      
      try {
        const result = JSON.parse(text);
        if (result.token) localStorage.setItem('token', result.token);
        return result;
      } catch (e) {
        throw new Error('Respuesta inválida');
      }
    },
    
    login: async (data: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Credenciales incorrectas');
      
      try {
        const result = JSON.parse(text);
        if (result.token) localStorage.setItem('token', result.token);
        return result;
      } catch (e) {
        throw new Error('Respuesta inválida');
      }
    },
    
    logout: (redirectUrl?: string) => {
      localStorage.removeItem('token');
      if (redirectUrl) window.location.href = redirectUrl;
    },
    
    me: async () => {
      return fetchWithAuth(`${API_URL}/api/users/me`);
    },
    
    isAuthenticated: async () => {
      const token = localStorage.getItem('token');
      if (!token) return false;
      try {
        await fetchWithAuth(`${API_URL}/api/users/me`);
        return true;
      } catch {
        return false;
      }
    },
  },
  
  lessons: {
    list: () => fetchWithAuth(`${API_URL}/api/lessons`),
    get: (id: string) => fetchWithAuth(`${API_URL}/api/lessons/${id}`),
    create: (data: any) => fetchWithAuth(`${API_URL}/api/lessons`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchWithAuth(`${API_URL}/api/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchWithAuth(`${API_URL}/api/lessons/${id}`, {
      method: 'DELETE',
    }),
  },
  
  progress: {
    list: () => fetchWithAuth(`${API_URL}/api/progress`),
    create: (data: any) => fetchWithAuth(`${API_URL}/api/progress`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchWithAuth(`${API_URL}/api/progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
  
  files: {
    list: () => fetchWithAuth(`${API_URL}/api/files`),
    get: (id: string) => fetchWithAuth(`${API_URL}/api/files/${id}`),
    create: (data: any) => fetchWithAuth(`${API_URL}/api/files`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchWithAuth(`${API_URL}/api/files/${id}`, {
      method: 'DELETE',
    }),
  },
  
  payments: {
    createCheckout: (data: any) => fetchWithAuth(`${API_URL}/api/payments/create-checkout`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
};

export function createPageUrl(pageName: string, params?: Record<string, string>) {
  const basePath = '/' + pageName.toLowerCase().replace(/ /g, '-');
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    return `${basePath}?${queryString}`;
  }
  return basePath;
}
