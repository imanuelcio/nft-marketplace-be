import supabase from "../database/connection";

export interface INFTData {
  token_id: string;
  name: string;
  description?: string;
  image_url?: string;
  animation_url?: string;
  external_url?: string;
  collection_id: string;
  creator_id: string;
  owner_id: string;
  metadata?: any;
  attributes?: any;
  contract_address?: string;
  blockchain: string;
  token_standard: string;
  supply?: number;
  is_minted?: boolean;
  is_listed?: boolean;
}

export const createNFT = async (nftData: INFTData) => {
  const {
    token_id,
    name,
    description,
    image_url,
    animation_url,
    external_url,
    collection_id,
    contract_address,
    blockchain,
    token_standard,
    supply,
    attributes,
  } = nftData;

  const { data: nft, error: error } = await supabase.from("nfts").insert([
    {
      token_id,
      name,
      description,
      image_url,
      animation_url,
      external_url,
      collection_id,
      contract_address,
      blockchain,
      token_standard,
      supply,
      attributes,
    },
  ]);

  if (error && error.code !== "PGRST116")
    throw new Error("Error creating NFT" + error.message);
};
