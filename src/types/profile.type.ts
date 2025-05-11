export interface UserProfile {
  id?: string;
  wallet_address: string;
  email?: string;
  username?: string;
  email_verified?: boolean;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

// Define API response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}
