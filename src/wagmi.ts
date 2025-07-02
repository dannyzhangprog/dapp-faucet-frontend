import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  anvil,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ...(process.env.NEXT_PUBLIC_ENABLE_LOCAL_NET === 'true' ? [anvil] : []),
  ],
  ssr: true,
});

import MyTokenABI from './contracts/MyToken.json';
import MTKFaucetABI from './contracts/MTKFaucet.json';

// 从环境变量获取合约地址
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;
const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;

// 导出合约实例
export const tokenContract = {
  address: tokenAddress,
  abi: MyTokenABI.abi,
};

export const faucetContract = {
  address: faucetAddress,
  abi: MTKFaucetABI.abi,
};
