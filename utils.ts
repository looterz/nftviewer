
export const prefixToUri = (uri: string) => {
  if (uri == null || uri == undefined) return uri;

  const hash = uri.split('://')[1];
  const prefix = uri.split('://')[0];

  switch (prefix) {
    case 'ar':
      return `https://arweave.net/${hash}`;
    case 'ipfs':
      return `https://ipfs.io/ipfs/${hash}`;
    default:
      return uri;
  }
};

export const blockchainToUri = (blockchain: string) => {
  if (blockchain == null || blockchain == undefined) return blockchain;
  
  switch (blockchain) {
    case 'eth':
      return 'ethereum';
    case 'polygon':
      return 'matic';
    case 'bsc':
      return 'binance-smart-chain';
    default:
      return 'ethereum';
  }
};
