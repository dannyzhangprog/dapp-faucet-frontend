// src/hooks/useIsAdmin.ts
import { useAccount, useReadContract } from 'wagmi';
import { faucetContract } from '../wagmi';

export const useIsAdmin = () => {
  const { address } = useAccount();
  const { data: owner, isLoading, error } = useReadContract({
    ...faucetContract,
    functionName: 'owner',
  });
  
  // 调试日志
  console.log('[useIsAdmin] Contract address:', faucetContract.address);
  console.log('[useIsAdmin] Owner data:', owner);
  console.log('[useIsAdmin] Current address:', address);
  console.log('[useIsAdmin] Error:', error);
  
  // 处理加载状态和错误
  if (isLoading) {
    console.log('[useIsAdmin] Loading owner data...');
    return false;
  }
  
  if (error) {
    console.error('[useIsAdmin] Error fetching owner:', error);
    return false;
  }
  
  // 处理空值情况
  if (!owner || !address) {
    console.log('[useIsAdmin] Owner or address is missing');
    return false;
  }
  
  try {
    // 确保 owner 是字符串
    const ownerStr = String(owner);
    
    // 比较地址（忽略大小写）
    const isAdmin = ownerStr.toLowerCase() === address.toLowerCase();
    console.log('[useIsAdmin] Is admin:', isAdmin);
    
    return isAdmin;
  } catch (e) {
    console.error('[useIsAdmin] Error comparing addresses:', e);
    return false;
  }
};