// Base URL for the API
const BASE_URL = 'http://localhost:5000';

// Create and export the API endpoints object
export const API_ENDPOINTS = {
    profile: `${BASE_URL}/api/profile`,  // Make sure this matches the backend route exactly
    login: `${BASE_URL}/auth/microsoft`,
    callback: `${BASE_URL}/auth/microsoft/callback`
};

// For debugging
console.log('API Endpoints:', API_ENDPOINTS);

export type ApiEndpoints = typeof API_ENDPOINTS;
export default API_ENDPOINTS;
