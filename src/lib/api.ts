const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: number; email: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async register(email: string, password: string) {
    const response = await this.request<{
      token: string;
      user: { id: number; email: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{
      user: { id: number; email: string; created_at: string };
    }>('/auth/me');
  }

  // Paywall endpoints
  async createPaywall(data: {
    title: string;
    description?: string;
    price: number;
    currency?: string;
    content: string;
  }) {
    return this.request<{
      paywall: {
        id: string;
        title: string;
        description?: string;
        price: number;
        currency: string;
        created_at: string;
      };
    }>('/paywalls', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyPaywalls() {
    return this.request<{
      paywalls: Array<{
        id: string;
        title: string;
        description?: string;
        price: number;
        currency: string;
        created_at: string;
        total_earnings: number;
        total_views: number;
        total_conversions: number;
      }>;
    }>('/paywalls/my');
  }

  async getPaywall(id: string) {
    return this.request<{
      paywall: {
        id: string;
        title: string;
        description?: string;
        price: number;
        currency: string;
        created_at: string;
        creator_email: string;
        has_access: boolean;
        content?: string;
      };
    }>(`/paywalls/${id}`);
  }

  async updatePaywall(id: string, data: Partial<{
    title: string;
    description: string;
    price: number;
    content: string;
  }>) {
    return this.request<{ message: string }>(`/paywalls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePaywall(id: string) {
    return this.request<{ message: string }>(`/paywalls/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async createPaymentSession(paywallId: string, walletAddress: string) {
    return this.request<{
      sessionId: string;
      swyptSession: {
        sessionId: string;
        amount: number;
        currency: string;
        title: string;
        description: string;
        successUrl: string;
        cancelUrl: string;
        webhookUrl: string;
        metadata: Record<string, any>;
      };
    }>('/payments/create-session', {
      method: 'POST',
      body: JSON.stringify({ paywallId, walletAddress }),
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.request<{
      payment: {
        id: string;
        status: string;
        amount: number;
        currency: string;
        paywall_title: string;
        created_at: string;
      };
    }>(`/payments/status/${paymentId}`);
  }

  async getPaymentHistory() {
    return this.request<{
      payments: Array<{
        id: string;
        amount: number;
        currency: string;
        status: string;
        created_at: string;
        paywall_title: string;
        paywall_id: string;
      }>;
    }>('/payments/history');
  }

  async getEarnings() {
    return this.request<{
      dailyEarnings: Array<{
        date: string;
        total_amount: number;
        transaction_count: number;
      }>;
      totalEarnings: {
        total: number;
        total_transactions: number;
      };
    }>('/payments/earnings');
  }

  // User endpoints
  async getUserProfile() {
    return this.request<{
      user: {
        id: number;
        email: string;
        created_at: string;
        total_paywalls: number;
        total_earnings: number;
      };
    }>('/users/profile');
  }

  async getUserPurchases() {
    return this.request<{
      purchases: Array<{
        payment_id: string;
        amount: number;
        currency: string;
        purchased_at: string;
        paywall_id: string;
        title: string;
        description?: string;
      }>;
    }>('/users/purchases');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);