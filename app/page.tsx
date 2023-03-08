"use client";

import { useCallback, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Card from "./card";
import { blockchainToUri } from "@/utils";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("0");
  const [lastPageToken, setLastPageToken] = useState("0");
  const [results, setResults] = useState<any[]>([]);
  const [previewNft, setPreviewNft] = useState<any>();
  const [open, setOpen] = useState(false);

  const searchEndpoint = (wallet, pageToken) =>
    `/api/collection/${wallet}/${pageToken}`;

  const isValidWalletAddress = (wallet) => {
    return wallet && wallet.length >= 26 && wallet.startsWith("0x");
  };

  const onChange = useCallback(
    (e) => {
      if (isValidWalletAddress(e.target.value) && !loading) {
        setResults([]);
        setWallet(e.target.value);
        setLoading(true);
        fetch(searchEndpoint(e.target.value, nextPageToken))
          .then((res) => res.json().catch(() => undefined))
          .then((data) => {
            if (
              data == undefined ||
              data.assets == undefined ||
              data.assets.length === 0
            ) {
              setResults([]);
              setLoading(false);
              return;
            }
            setResults(data?.assets);
            setNextPageToken(data?.nextPageToken);
            setLoading(false);
          });
      } else {
        setResults([]);
      }
    },
    [nextPageToken, loading]
  );

  const loadMore = useCallback(() => {
    if (!isValidWalletAddress(wallet)) {
      return;
    }

    setLoading(true);
    fetch(searchEndpoint(wallet, nextPageToken))
      .then((res) => res.json())
      .then((data) => {
        if (data.err !== undefined) {
          setLoading(false);
          return;
        }

        if (
          data == undefined ||
          data.assets == undefined ||
          data?.assets?.length === 0
        ) {
          setLoading(false);
          return;
        }

        setResults([...results, ...data?.assets]);

        if (data.nextPageToken === lastPageToken) {
          setLoading(false);
          setNextPageToken("0");
          return;
        }

        setLastPageToken(nextPageToken);
        setNextPageToken(data.nextPageToken);
        setLoading(false);
      });
  }, [wallet, nextPageToken, lastPageToken, results]);

  const openPreview = useCallback((nft) => {
    console.log("openPreview", nft);
    setPreviewNft(nft);
    setOpen(true);
  }, []);

  const purchaseNft = useCallback((nft) => {
    window.open(
      `https://opensea.io/assets/${blockchainToUri(nft.blockchain)}/${
        nft.contractAddress
      }/${nft.tokenId}`,
      "_blank"
    );
  }, []);

  return (
    <div className="isolate bg-gray-900 min-h-screen w-full from-gray-900 to-fuchsia-800 background-animate">
      <main>
        <div className="relative py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-bold animate-text text-transparent text-5xl md:text-7xl lg:text-8xl xl:text-9x1 bg-clip-text bg-gradient-to-r from-pink-400 to-red-600">
                NFT Viewer
              </h1>
              <p className="my-8 text-xl leading-8 text-gray-300">
                Enter a wallet address to view their NFTs
              </p>
              <div className="flex items-center justify-center gap-x-6">
                <input
                  type="text"
                  placeholder="Wallet address 0x..."
                  className="backdrop-filter backdrop-blur-sm bg-opacity-30 bg-black w-full px-6 py-6 text-center text-2xl font-sans font-semibold text-white rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 focus:outline-none"
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* NFT Collection Grid */}
          {results?.length > 0 && (
            <div className="mx-auto justify-center my-32 flex flex-wrap mb-4">
              {results.map((nft, index) => (
                <Card key={index} nft={nft} openPreview={openPreview} />
              ))}
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div
              className="mt-16 flex items-center justify-center"
              role="status"
            >
              <svg
                aria-hidden="true"
                className="rounded inline w-32 h-32 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {/* Load More Button */}
          <div className="mt-16 flex items-center justify-center">
            {nextPageToken != "0" && !loading && (
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-300 to-red-400 hover:from-purple-400 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                onClick={loadMore}
              >
                Load More
              </button>
            )}
          </div>

          {/* Modal for viewing an individual NFT */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900 backdrop-blur-sm bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                      <div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-white"
                          >
                            {previewNft?.name}
                            <h2 className="text-indigo-400">
                              {previewNft?.collectionName}
                            </h2>
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-white">
                              {previewNft?.metadata?.description}
                            </p>
                            <p className="text-sm text-white mt-5">
                              Owned by {previewNft?.owner}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          onClick={() => purchaseNft(previewNft)}
                        >
                          Purchase
                        </button>
                        <button
                          type="button"
                          className="mt-5 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={() => setOpen(false)}
                        >
                          Go back to dashboard
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </main>
    </div>
  );
}
