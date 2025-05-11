import { userModel } from "../models/user";
import { UserInput, User } from "../types/user.type";

export const userService = {
  async getAllUser(): Promise<User[]> {
    return userModel.getAlluser();
  },

  async getUserProfile(idOrWallet: string): Promise<User> {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(idOrWallet)) {
      return await userModel.getuserByID(idOrWallet);
    } else {
      return await userModel.getUserByWalletAddress(idOrWallet);
    }
  },

  async updateProfile(
    id: string,
    walletAddress: string,
    userData: UserInput
  ): Promise<User> {
    return await userModel.updateUserProfile(id, walletAddress, userData);
  },
};
