// src/utils/formatUnits.ts
import { formatUnits, parseUnits } from 'viem';

// 转换为显示字符串（带小数）
export const formatTokenDisplay = (value: bigint | undefined, decimals = 18) => {
  if (!value) return "0";
  return formatUnits(value, decimals);
};

// 转换为合约需要的最小单位 (BigInt)
export const parseTokenInput = (value: string, decimals = 18) => {
  try {
    return parseUnits(value, decimals);
  } catch {
    return BigInt(0);
  }
};