// Backend URLs for different environments
const BACKEND_URLS = {
    development: 'http://localhost:4100', // Local dev server
    production: 'https://singularity-100x-genai-buildathon.onrender.com', // Production server
  } as const;
  
  // Determine current environment
  const getEnvironment = (): keyof typeof BACKEND_URLS => {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  };
  
  // Get backend URL based on current environment
  export const getBackendUrl = (): string => {
    const env = getEnvironment();
    return BACKEND_URLS[env];
  };
  
  // Centralized config object
  export const config = {
    backendUrl: getBackendUrl(),
  } as const;
  
  // Export URL separately if needed
  export const backendUrl = getBackendUrl();
  