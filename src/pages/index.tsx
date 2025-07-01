// src/pages/index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useFaucet } from '../hooks/useFaucet';
import { useIsAdmin } from '../hooks/useIsAdmin';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const isAdmin = useIsAdmin();
  const {
    faucetBalance,
    userBalance,
    dripLimit,
    lastDripTime,
    dripInterval,
    tokenDecimals,
    dripTokens,
    mintTokens,
    approveFaucet,
    depositToFaucet,
    setDripInterval,
    setDripLimit,
  } = useFaucet();

  // 状态初始化
  const [dripAmount, setDripAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [newDripInterval, setNewDripInterval] = useState(dripInterval);
  const [newDripLimit, setNewDripLimit] = useState(dripLimit);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 地址格式化函数
  const formatAddress = (addr: string | null | undefined) => {
    if (!addr) return '';
    if (addr.length >= 10) {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    return addr;
  };

  // 时间格式化函数
  const formatTimestamp = (timestamp: number | null | undefined) => {
    if (!timestamp) return '-';
    try {
      const date = new Date(Number(timestamp) * 1000);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    } catch (e) {
      console.error('格式化时间错误:', e);
      return '-';
    }
  };

  // 领取代币
  const handleDrip = async () => {
    if (!dripAmount) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      await dripTokens(dripAmount);
      alert('代币领取成功!');
      setDripAmount('');
    } catch (error: any) {
      console.error('领取失败:', error);
      setErrorMessage(error.shortMessage || error.message || '领取失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 铸造代币
  const handleMint = async () => {
    if (!mintAmount) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      await mintTokens(mintAmount);
      alert('代币铸造成功!');
      setMintAmount('');
    } catch (error: any) {
      console.error('铸造失败:', error);
      setErrorMessage(error.shortMessage || error.message || '铸造失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 授权操作
  const handleApprove = async () => {
    if (!approveAmount) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      await approveFaucet(approveAmount);
      alert('授权成功!');
      setApproveAmount('');
    } catch (error: any) {
      console.error('授权失败:', error);
      setErrorMessage(error.shortMessage || error.message || '授权失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 存入操作
  const handleDeposit = async () => {
    if (!depositAmount) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      await depositToFaucet(depositAmount);
      alert('存入水龙头成功!');
      setDepositAmount('');
    } catch (error: any) {
      console.error('存入失败:', error);
      setErrorMessage(error.shortMessage || error.message || '存入失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 更新领取间隔
  const handleSetDripInterval = async () => {
    if (!newDripInterval) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      await setDripInterval(newDripInterval);
      alert('领取间隔更新成功!');
    } catch (error: any) {
      console.error('更新失败:', error);
      setErrorMessage(error.shortMessage || error.message || '更新失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 更新领取限制
  const handleSetDripLimit = async () => {
    if (!newDripLimit) return;
    
    setIsLoading(true);
    setErrorMessage('');
    try {
      await setDripLimit(newDripLimit);
      alert('领取限制更新成功!');
    } catch (error: any) {
      console.error('更新失败:', error);
      setErrorMessage(error.shortMessage || error.message || '更新失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <h1>请先连接钱包</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>MTK 代币水龙头</h1>
        <p className={styles.subtitle}>免费领取一定数量的 MTK 代币</p>
      </div>
      
      <div className={styles.networkInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>当前账户:</span>
          <span className={styles.infoValue}>{formatAddress(address)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>账户代币余额:</span>
          <span className={styles.infoValue}>{userBalance} MTK</span>
        </div>
        {isAdmin && (
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>账户权限:</span>
            <span className={styles.infoValue}>管理员</span>
          </div>
        )}
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>水龙头信息</h2>
        
        <div className={styles.configItem}>
          <span className={styles.configLabel}>MTK 代币地址:</span>
          <span className={styles.configValue}>0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
          {isAdmin && (
            <button className={styles.configButton} disabled={isLoading}>
              修改
            </button>
          )}
        </div>
        
        <div className={styles.configItem}>
          <span className={styles.configLabel}>Faucet 合约地址:</span>
          <span className={styles.configValue}>0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512</span>
          {isAdmin && (
            <button className={styles.configButton} disabled={isLoading}>
              修改
            </button>
          )}
        </div>
        
        <div className={styles.configItem}>
          <span className={styles.configLabel}>领取时间间隔 (秒):</span>
          {isAdmin ? (
            <>
              <input
                className={styles.configInput}
                type="text"
                value={newDripInterval}
                onChange={(e) => setNewDripInterval(e.target.value)}
                disabled={isLoading}
              />
              <button 
                className={styles.configButton}
                onClick={handleSetDripInterval}
                disabled={isLoading}
              >
                修改
              </button>
            </>
          ) : (
            <span className={styles.configValue}>{dripInterval}</span>
          )}
        </div>
        
        <div className={styles.configItem}>
          <span className={styles.configLabel}>单次最大领取限额:</span>
          {isAdmin ? (
            <>
              <input
                className={styles.configInput}
                type="text"
                value={newDripLimit}
                onChange={(e) => setNewDripLimit(e.target.value)}
                disabled={isLoading}
              />
              <button 
                className={styles.configButton}
                onClick={handleSetDripLimit}
                disabled={isLoading}
              >
                修改
              </button>
            </>
          ) : (
            <span className={styles.configValue}>{dripLimit} MTK</span>
          )}
        </div>
        
        <div className={styles.configItem}>
          <span className={styles.configLabel}>当前水龙头余额:</span>
          <span className={styles.configValue}>{faucetBalance} MTK</span>
        </div>
        
        <div className={styles.configItem}>
          <span className={styles.configLabel}>上次领取时间:</span>
          <span className={styles.configValue}>{formatTimestamp(lastDripTime)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>领取代币</h2>
        <input
          className={styles.dripInput}
          type="text"
          value={dripAmount}
          onChange={(e) => setDripAmount(e.target.value)}
          placeholder="输入领取数量"
          disabled={isLoading}
        />
        <button 
          className={styles.dripButton}
          onClick={handleDrip}
          disabled={isLoading}
        >
          立即领取!
        </button>
        
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        
        {faucetBalance === "0" && !errorMessage && (
          <p className={styles.errorMessage}>水龙头代币不足，请联系管理员</p>
        )}
        
      </div>

      {isAdmin && (
        <div className={styles.adminSection}>
          <h2 className={styles.sectionTitle}>管理员功能</h2>
          
          <div className={styles.adminFunction}>
            <h3 className={styles.adminFunctionTitle}>铸造代币</h3>
            <input
              className={styles.dripInput}
              type="text"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="输入铸造数量"
              disabled={isLoading}
            />
            <button 
              className={styles.dripButton}
              onClick={handleMint}
              disabled={isLoading}
            >
              铸造
            </button>
          </div>

          <div className={styles.adminFunction}>
            <h3 className={styles.adminFunctionTitle}>授权水龙头</h3>
            <input
              className={styles.dripInput}
              type="text"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              placeholder="输入授权数量"
              disabled={isLoading}
            />
            <button 
              className={styles.dripButton}
              onClick={handleApprove}
              disabled={isLoading}
            >
              授权
            </button>
            <p className={styles.adminNote}>
              注意: 授权允许水龙头合约从您的账户转移代币
            </p>
          </div>

          <div className={styles.adminFunction}>
            <h3 className={styles.adminFunctionTitle}>存入水龙头</h3>
            <input
              className={styles.dripInput}
              type="text"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="输入存入数量"
              disabled={isLoading}
            />
            <button 
              className={styles.dripButton}
              onClick={handleDeposit}
              disabled={isLoading}
            >
              存入
            </button>
            <p className={styles.adminNote}>
              注意: 存入操作会将您账户中的代币转移到水龙头合约
            </p>
          </div>
        </div>
      )}
      
      <p className={styles.debugNote}>代币精度: {tokenDecimals} 位小数</p>
      <ConnectButton />
    </div>
  );
}