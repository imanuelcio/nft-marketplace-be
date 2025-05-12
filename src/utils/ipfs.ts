import { NFTStorage, File } from "nft.storage";
import fs from "fs";
import path from "path";
const tokenNFT = process.env.NFT_STORAGE_TOKEN as string;

if (!tokenNFT) {
  throw new Error("NFT_STORAGE_TOKEN is not defined");
}

const client = new NFTStorage({
  token: tokenNFT ? tokenNFT.trim() : "",
});
// const metadata = {
//   name: "My First NFT",
//   description: "This is my first NFT on IPFS.",
//   attributes: [
//     { trait_type: "Background", value: "Red" },
//     { trait_type: "Size", value: "Large" },
//   ],
// };
// const imagePath = path.join(__dirname, "/src/utils", "images", "nft.jpg");

const uploadToIPFS = async (imagePath: string, metadata: any) => {
  const imageFile = fs.readFileSync(imagePath);
  const image = new File([imageFile], "nft.jpg", { type: "image/jpeg" });

  try {
    const metadataWithFile = {
      ...metadata,
      image: new URL(`ipfs://${(await client.storeBlob(image)).toString()}`),
    };

    const metadataCID = await client.store(metadataWithFile);
    console.log("Uploading to IPFS...");
    const ipfsURL = `https://${metadataCID}.ipfs.nftstorage.link/`;
    if (!ipfsURL) throw new Error("IPFS upload failed");
    console.log("Uploaded success", ipfsURL);
    return { ipfsURL };
  } catch (error) {
    console.log(error);
  }
};

export default uploadToIPFS;
