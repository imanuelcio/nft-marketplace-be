export interface User {
  id: string;
  wallet_address: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface UserInput {
  username?: string;
  email?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
}

export interface AuthToken {
  walletAddress: string;
  userId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// For augmenting Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        walletAddress: string;
      };
    }
  }
}
