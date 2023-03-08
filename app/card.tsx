"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { prefixToUri } from "@/utils";

export default function Card(props) {
  const [contentType, setContentType] = useState("");
  const [mediaSrc, setMediaSrc] = useState("");
  const [loading, setLoading] = useState(true);

  let imageUrl = prefixToUri(
    props.nft.imageUrl != "" ? props.nft.imageUrl : props.nft.metadata.image
  );
  useEffect(() => {
    if (
      imageUrl == undefined ||
      imageUrl == "" ||
      imageUrl == "https://ipfs.io/ipfs/"
    ) {
      imageUrl = "/missing-image.webp";
    }

    fetch(imageUrl)
      .then((response) => {
        setContentType(response.headers.get("Content-Type") || "");
        return response.blob();
      })
      .then((blob) => {
        setMediaSrc(URL.createObjectURL(blob));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [imageUrl]);

  return (
    <div
      className="flex mx-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 group bg-black backdrop-filter backdrop-blur-md bg-opacity-20 border-4 border-red-700"
      onClick={() => {
        props.openPreview(props.nft);
      }}
    >
      {contentType.startsWith("image/") && mediaSrc != "" && (
        <NextImage
          className="w-full h-full opacity-90 object-cover"
          alt={props.nft.name}
          src={mediaSrc}
          width={300}
          height={300}
        />
      )}
      {contentType.startsWith("video/") && mediaSrc != "" && (
        <video
          className="w-full h-full opacity-90 object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={mediaSrc} type={contentType} />
          Your browser does not support HTML5 video.
        </video>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-5 group-hover:bg-opacity-50 transition duration-150 ease-in-out">
        <h1 className="text-2xl text-white group-hover:text-red-600 text-center">
          {props.nft?.name || props.nft?.metadata?.name || "No Name Available"}
        </h1>
        <h2 className="text-sm text-white group-hover:text-red-600 text-center">
          {props.nft?.collectionName || "No Collection"}
        </h2>
      </div>
    </div>
  );
}
