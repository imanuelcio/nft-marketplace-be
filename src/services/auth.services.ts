import { randomBytes } from "crypto";
import { ethers } from "ethers";
import { signJwt } from "../utils/jwt";
import supabase from "../database/connection";

// Mendapatkan atau membuat nonce untuk wallet
export const getNonce = async (walletAddress: string) => {
  const lowerWallet = walletAddress.toLowerCase();

  // Cari user berdasarkan wallet address
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("wallet_address", lowerWallet)
    .single();

  if (userError && userError.code !== "PGRST116") {
    throw new Error("Error fetching user: " + userError.message);
  }

  let userId = user?.id;

  // Jika user belum ada, buat baru
  if (!user) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ wallet_address: lowerWallet }])
      .select("id")
      .single();

    if (insertError) {
      throw new Error("Error creating user: " + insertError.message);
    }

    userId = newUser.id;
  }

  // Cek apakah ada nonce aktif yang belum kadaluarsa
  const now = new Date().toISOString();
  const { data: existingNonce } = await supabase
    .from("nonce_tokens")
    .select("nonce")
    .eq("user_id", userId)
    .gt("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existingNonce) {
    return { nonce: existingNonce.nonce };
  }

  // Buat nonce baru
  const newNonce = randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 menit

  const { error: nonceError } = await supabase.from("nonce_tokens").insert([
    {
      user_id: userId,
      nonce: newNonce,
      expires_at: expiresAt,
    },
  ]);

  if (nonceError) {
    console.error("Nonce insert error", nonceError);
    throw new Error("Error saving nonce: " + nonceError.message);
  }

  return { nonce: newNonce };
};

// Verifikasi signature SIWE
export const verifySignature = async (
  walletAddress: string,
  signature: string
) => {
  const lowerWallet = walletAddress.toLowerCase();

  // Ambil user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("wallet_address", lowerWallet)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  // Ambil nonce yang masih valid
  const now = new Date().toISOString();
  const { data: validNonce, error: nonceError } = await supabase
    .from("nonce_tokens")
    .select("id, nonce")
    .eq("user_id", user.id)
    .gt("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  console.log(validNonce, nonceError);
  if (nonceError || !validNonce) {
    throw new Error("No valid nonce found");
  }

  const messageNonce = `Login nonce ${validNonce.nonce}`;
  const recoveredAddress = ethers.verifyMessage(messageNonce, signature);

  if (recoveredAddress.toLowerCase() !== lowerWallet) {
    throw new Error("Signature verification failed");
  }

  // Hapus nonce setelah dipakai
  await supabase.from("nonce_tokens").delete().eq("id", validNonce.id);

  // Update last logincs
  await supabase
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  const token = signJwt({
    walletAddress: lowerWallet,
    userId: user.id,
  });

  return { token };
};
