// src/hooks/useFaucet.ts
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { faucetContract, tokenContract } from '../wagmi';
import { formatUnits, parseUnits } from 'viem';

export const useFaucet = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // 读取代币精度
  const { data: decimals } = useReadContract({
    ...tokenContract,
    functionName: 'decimals',
  });
  
  const tokenDecimals = decimals ? Number(decimals) : 18;

  // 读取水龙头余额
  const { data: faucetBalanceRaw } = useReadContract({
    ...tokenContract,
    functionName: 'balanceOf',
    args: [faucetContract.address],
  });

  // 读取账户代币余额
  const { data: userBalanceRaw } = useReadContract({
    ...tokenContract,
    functionName: 'balanceOf',
    args: [address],
  });

  // 读取领取限制
  const { data: dripLimitRaw } = useReadContract({
    ...faucetContract,
    functionName: 'getDripLimit',
  });
  
  // 读取领取间隔
  const { data: dripInterval } = useReadContract({
    ...faucetContract,
    functionName: 'getDripInterval',
  });
  
  // 读取用户上次领取时间
  const { data: lastDripTimeRaw } = useReadContract({
    ...faucetContract,
    functionName: 'getDripTime',
    args: [address],
  });

  // 转换为完整代币单位
  const formatToFullToken = (value: bigint | undefined): string => {
    if (!value) return "0";
    try {
      const divisor = 10 ** tokenDecimals;
      const fullToken = Number(value) / divisor;
      return fullToken.toFixed(0);
    } catch (e) {
      console.error('转换代币单位错误:', e);
      return value.toString();
    }
  };

  // 格式化时间戳
  const lastDripTime = lastDripTimeRaw !== null && lastDripTimeRaw !== undefined 
    ? Number(lastDripTimeRaw) 
    : null;

  return {
    faucetBalance: formatToFullToken(faucetBalanceRaw as bigint | undefined),
    userBalance: formatToFullToken(userBalanceRaw as bigint | undefined),
    dripLimit: formatToFullToken(dripLimitRaw as bigint | undefined),
    dripInterval: dripInterval ? dripInterval.toString() : "0",
    lastDripTime,
    tokenDecimals,
    dripTokens: async (amount: string) => {
      const amountBigInt = parseUnits(amount, tokenDecimals);
      return writeContractAsync({
        ...faucetContract,
        functionName: 'drip',
        args: [amountBigInt],
      });
    },
    mintTokens: async (amount: string) => {
      const amountBigInt = parseUnits(amount, tokenDecimals);
      return writeContractAsync({
        ...tokenContract,
        functionName: 'mint',
        args: [amountBigInt],
      });
    },
    approveFaucet: async (amount: string) => {
      const amountBigInt = parseUnits(amount, tokenDecimals);
      return writeContractAsync({
        ...tokenContract,
        functionName: 'approve',
        args: [faucetContract.address, amountBigInt],
      });
    },
    depositToFaucet: async (amount: string) => {
      const amountBigInt = parseUnits(amount, tokenDecimals);
      return writeContractAsync({
        ...faucetContract,
        functionName: 'deposit',
        args: [amountBigInt],
      });
    },
    // 新增管理员配置函数
    setDripInterval: async (interval: string) => {
      const intervalBigInt = BigInt(interval);
      return writeContractAsync({
        ...faucetContract,
        functionName: 'setDripInterval',
        args: [intervalBigInt],
      });
    },
    setDripLimit: async (limit: string) => {
      const limitBigInt = parseUnits(limit, tokenDecimals);
      return writeContractAsync({
        ...faucetContract,
        functionName: 'setDripLimit',
        args: [limitBigInt],
      });
    },
  };
};