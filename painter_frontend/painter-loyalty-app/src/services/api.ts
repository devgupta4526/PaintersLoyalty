import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:4000/api';

class ApiService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getToken();
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
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async sendOtp(mobile: string, email?: string) {
    const body: any = { mobile };
    if (email) body.email = email;
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async verifyOtp(mobile: string, email: string, otp: string) {
    const body: any = { mobile, otp };
    if (email) body.email = email;
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Painter
  async getProfile() {
    return this.request('/painter/profile');
  }

  async updateProfile(profile: any) {
    return this.request('/painter/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async uploadPhoto(photoUri: string) {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    return this.request('/painter/photo', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadKyc(idProofUri: string) {
    const formData = new FormData();
    formData.append('idProof', {
      uri: idProofUri,
      type: 'image/jpeg',
      name: 'idProof.jpg',
    } as any);

    return this.request('/painter/kyc', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async addSkills(skills: string[]) {
    return this.request('/painter/skills', {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
  }

  async getPortfolio() {
    return this.request('/painter/portfolio');
  }

  // Dashboard
  async getDashboard() {
    return this.request('/dashboard/');
  }

  // Coupons
  async validateCoupon(code: string) {
    return this.request('/coupon/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async redeemCoupon(code: string) {
    return this.request('/coupon/redeem', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async getMyCoupons() {
    return this.request('/coupon/my');
  }

  // Wallet
  async getWalletSummary() {
    return this.request('/wallet/summary');
  }

  async getMonthlyEarnings(year: number) {
    return this.request(`/wallet/monthly?year=${year}`);
  }

  async getQuarterlyEarnings(year: number) {
    return this.request(`/wallet/quarterly?year=${year}`);
  }

  async getYearlyEarnings() {
    return this.request('/wallet/yearly');
  }

  async getTransactions(filters: any = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/wallet/transactions?${query}`);
  }

  async getWithdrawalEligibility() {
    return this.request('/wallet/withdrawal-eligibility');
  }

  // Withdrawals
  async createWithdrawalRequest(request: { amount: number; bankDetails: any }) {
    return this.request('/withdrawals/request', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getWithdrawals() {
    return this.request('/withdrawals/my');
  }

  // Offers
  async getOffers() {
    return this.request('/offers/');
  }

  async getInProgressOffers() {
    return this.request('/offers/in-progress');
  }

  async getRedeemedOffers() {
    return this.request('/offers/redeemed');
  }

  async getClosedOffers() {
    return this.request('/offers/closed');
  }

  async participateInOffer(offerId: string) {
    return this.request(`/offers/${offerId}/join`, {
      method: 'POST',
    });
  }

  async getOfferProgress(offerId: string) {
    return this.request(`/offers/${offerId}/progress`);
  }

  async completeOffer(offerId: string) {
    return this.request(`/offers/${offerId}/complete`, {
      method: 'POST',
    });
  }

  // Trainings
  async getTrainings() {
    return this.request('/trainings/');
  }

  async startTraining(trainingId: string) {
    return this.request(`/trainings/${trainingId}/start`, {
      method: 'POST',
    });
  }

  async completeTraining(trainingId: string) {
    return this.request(`/trainings/${trainingId}/complete`, {
      method: 'POST',
    });
  }

  async completeTrainingModule(trainingId: string, moduleId: string) {
    return this.request(`/trainings/${trainingId}/modules/${moduleId}/complete`, {
      method: 'POST',
    });
  }

  // Products
  async getProducts(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return this.request(`/products?${params.toString()}`);
  }

  // Complaints
  async getComplaintCategories() {
    return this.request('/complaints/categories');
  }

  async createComplaint(complaint: any) {
    return this.request('/complaints/', {
      method: 'POST',
      body: JSON.stringify(complaint),
    });
  }

  async getComplaints() {
    return this.request('/complaints/my');
  }

  async getComplaintHistory(complaintId: string) {
    return this.request(`/complaints/${complaintId}/history`);
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications/');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();