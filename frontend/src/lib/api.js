const API_BASE_URL = 'http://localhost:5001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Helper method to make API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Routes endpoints
  async getRoutes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/routes?${queryString}`);
  }

  async getRoute(id) {
    return this.request(`/routes/${id}`);
  }

  async createRoute(routeData) {
    return this.request('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async startRun(routeId) {
    return this.request(`/routes/${routeId}/start`, {
      method: 'POST',
    });
  }

  async endRun(routeId, runData) {
    return this.request(`/routes/${routeId}/end`, {
      method: 'POST',
      body: JSON.stringify(runData),
    });
  }

  async getUserHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/routes/user/history?${queryString}`);
  }

  // Leaderboard endpoints
  async getRouteLeaderboard(routeId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaderboard/route/${routeId}?${queryString}`);
  }

  async getDistrictLeaderboard(district, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaderboard/district/${district}?${queryString}`);
  }

  async getOverallLeaderboard(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaderboard/overall?${queryString}`);
  }

  async getUserStats(userId) {
    return this.request(`/leaderboard/user/${userId}`);
  }

  async getRecentRuns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaderboard/recent-runs?${queryString}`);
  }

  async getDifficultyLeaderboard(difficulty, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaderboard/difficulty/${difficulty}?${queryString}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
