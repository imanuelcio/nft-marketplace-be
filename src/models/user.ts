import supabase from "../database/connection";
import { UserInput, User } from "../types/user.type";

export const userModel = {
  async getAlluser(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw new Error(error.message);
    return data as User[];
  },

  async getuserByID(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("User not found");
      }
      throw new Error(error.message);
    }

    return data as User;
  },

  // should return lowercase on req.params
  async getUserByWalletAddress(walletAddress: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();
    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("User not found");
      }
      throw new Error(error.message);
    }

    return data as User;
  },

  async updateUserProfile(
    id: string,
    walletAddress: string,
    userData: UserInput
  ): Promise<User> {
    const user = await this.getuserByID(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.wallet_address !== walletAddress) {
      throw new Error("Wallet address does match user ID");
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Error updating profile for user with ID ${id}: ${error.message}`
      );
    }

    return data as User;
  },
};
