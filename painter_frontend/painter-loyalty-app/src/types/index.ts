// Types for Painter Loyalty App

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'PAINTER' | 'ADMIN' | 'DEALER';
  isKycApproved: boolean;
  region?: string;
  skills?: string[];
  totalPointsEarned: number;
  totalCouponsRedeemed: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  value: number;
  status: 'UNUSED' | 'REDEEMED' | 'EXPIRED';
  redeemedAt?: Date;
  assignedTo?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CLOSED';
  dealerApproved: boolean;
  participants: string[];
}

export interface Training {
  id: string;
  title: string;
  category: string;
  isActive: boolean;
  isNew?: boolean;
}

export interface Complaint {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  images?: string[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Wallet {
  balance: number;
  monthlyEarnings: number;
  quarterlyEarnings: number;
  yearlyEarnings: number;
}

export interface DashboardData {
  walletBalance: number;
  monthlyEarnings: number;
  quarterlyEarnings: number;
  yearlyEarnings: number;
  latestOffers: Offer[];
  newTrainings: Training[];
  latestNotifications: Notification[];
  complaintSummary: { [key: string]: number };
  offerProgressSummary: {
    inProgress: number;
    completed: number;
  };
  trainingHighlights: {
    completed: number;
    inProgress: number;
  };
  withdrawalEligibility: {
    quarterlyEligible: boolean;
    yearlyEligible: boolean;
    nextQuarterlyDate: string;
    nextYearlyDate: string;
  };
}