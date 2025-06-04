import { useWallet } from '@suiet/wallet-kit';
import { Button } from './ui/button';
import { useState } from 'react';

export function WalletConnector() {
  const { connected, connecting, disconnect, select, currentWallet } = useWallet();
  const [isSigning, setIsSigning] = useState(false);

  const walletState = useWallet();
console.log(walletState);


  const handleConnect = async () => {
    if (!connected) {
      await select('suiet'); // or another wallet name
    } else {
      await disconnect();
    }
  };

  const handleSignMessage = async () => {
    if (!connected) return;

    setIsSigning(true);
    try {
      const message = 'Please sign this message to authenticate';
      const signature = await currentWallet?.signMessage(message);
      console.log('Signature:', signature);
      // send signature to backend if needed
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button onClick={handleConnect} disabled={connecting}>
          {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect Wallet'}
        </Button>
        {connected && (
          <Button onClick={handleSignMessage} disabled={isSigning}>
            {isSigning ? 'Signing...' : 'Sign Message'}
          </Button>
        )}
      </div>
      {connected && (
        <div className="text-sm text-gray-600">
          Connected with: {currentWallet?.name}
        </div>
      )}
    </div>
  );
}
