import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { nftAddress, nftMarketplaceAddress } from "../../config/networkAddress";
import NFTAbi from "../../abi/NFT.json";
import NFTMarketplaceAbi from "../../abi/NFTMarketplace.json";
import axios from "axios";
import Web3Modal from "web3modal";
import Card from "../../subcomponents/cards/Card";
import Link from "next/link";

export default function SellerItems() {
  const [listedNFTs, setListedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyNFTs = async () => {
    setLoading(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftAddress, NFTAbi.abi, signer);
    const nftMarketPlaceContract = new ethers.Contract(
      nftMarketplaceAddress,
      NFTMarketplaceAbi.abi,
      signer
    );
    const data = await nftMarketPlaceContract.getSellerListedItems();
    console.log("This is your data ", data)

    const allItems = await Promise.all(
      data?.map(async (i) => {
        let convertedPrice = ethers.utils.formatUnits(
          i.price.toString(),
          "ether"
        );
        const tokenUri = await nftContract.tokenURI(i.tokenId);
        const metaData = await axios.get(tokenUri);
        let item = {
          price: convertedPrice,
          sold: i.sold,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        };
        console.log(item)
        return item;
      })
    );
    let currentListedItems = allItems.filter(item => !item.sold);
    setListedNFTs(currentListedItems);
    let soldItems = allItems.filter(item => item.sold)
    setSoldNFTs(soldItems);
    console.log(soldItems);
    console.log(currentListedItems)
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await loadMyNFTs();
      console.log(listedNFTs);
    };
    load();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-2">
        {listedNFTs.length && !loading ? (
           
          listedNFTs?.map((nft, index) => (
            <div id={index}>
              <Card
                nft={nft}
                onClick={() => {
                  buyNFT(nft);
                  console.log("Onclicked on buy button.");
                }}
              />
            </div>
          ))
        ) : (
          <div className="text-center font-semibold text-base">
            No Listed NFTs found 
            <Link href="/list">List Now</Link>
          </div>
        )}
      </div>

      {/* Sold list */}
      <div className="grid grid-cols-3">
        {soldNFTs.length && !loading ? (
          soldNFTs?.map((nft, index) => (
            <div id={index}>
              <Card
                nft={nft}
                showBtn={false}
                onClick={() => {
                  buyNFT(nft);
                  console.log("Onclicked on buy button.");
                }}
              />
            </div>
          ))
        ) : (
          <div className="text-center font-semibold text-base">
            No NFTs sold yet 
            {/* <Link href="/list">List Now</Link> */}
          </div>
        )}
      </div>
    </div>
  );
}
