import axios from "axios";

const api = axios.create({
  baseURL: "https://singularity-100x-genai-buildathon.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  // Don't throw on non-2xx status codes - we'll handle them in the response interceptor
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Don't throw for 4xx errors
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    
    // Skip adding auth header for login/register endpoints
    if (config.url?.includes('/users/login') || config.url?.includes('/users/register')) {
      return config;
    }
    
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API] No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(error);
    }
    
    const { status } = error.response;
    
    // Handle 401 Unauthorized
    if (status === 401) {
      console.log('Received 401, clearing auth data');
      // Only clear and redirect if we're not already on the login page
      if (!window.location.pathname.includes('login') && !window.location.pathname === '/') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
