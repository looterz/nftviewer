import { prefixToUri } from "@/utils";
import { AnkrProvider, Nft } from "@ankr.com/ankr.js";

const provider = new AnkrProvider("");

export default async function handler(req, res) {
  return new Promise(async (resolve, reject) => {
    const { walletAddress, pageToken } = req.query;
    let assets: any = [];

    await provider
      .getNFTsByOwner({
        walletAddress: walletAddress,
        blockchain: ["eth", "polygon", "bsc"],
        pageSize: 20,
        pageToken: pageToken != "0" ? pageToken : undefined,
      })
      .then((data) => {
        // Handle some NFTs having their image stored in a different location, specified in their metadata url
        // If imageUrl is empty, fetch metadata and use the image url from there, wait for all promises to resolve
        Promise.all(
          data.assets.map(async (asset) => {
            let newAsset: any = { ...asset, metadata: {}, owner: walletAddress };
            if (asset.tokenUrl != "") {
              await fetch(prefixToUri(asset.tokenUrl))
                .then((res) => res.json().catch((err) => console.log(err)))
                .then((metaData) => {
                  newAsset.metadata = metaData;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              console.log("No imageUrl found for " + asset.name);
            }
            assets.push(newAsset);
          })
        )
          .then(() => {
            res
              .status(200)
              .json({ assets: assets, nextPageToken: data.nextPageToken });
            resolve(1);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
            resolve(1);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
        resolve(1);
      });
  });
}
