import { KeyRound, Keyboard } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from 'react'
interface WalletInfoCardProps {
  walletAddress: string
  walletName: string
  setWalletName: (walletName: string) => void
  createdAt: string
  setCreatedAt: (createdAt: string) => void
}

export default function WalletInfoCard(prop: WalletInfoCardProps) {
  const walletAddress = prop.walletAddress;
  const {walletName, setWalletName, createdAt, setCreatedAt} = prop;
  const [passphraseHint, setPassphraseHint] = useState("");
  const [derivationPathHint, setDerivationPath] = useState("");
  console.log(walletAddress);
  const[data, setData] = useState();
  useEffect(() => {
    fetch(`/api/hints?address=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      setData(data);
      setWalletName(data.name);
      setPassphraseHint(data.passphraseHint);
      setDerivationPath(data.derivationPathHint);
      console.log(new Date(data.created)+" "+new Date());
      setCreatedAt(data.created);
    })
  }, [walletAddress]);

  return (
    <Card className="w-full max-w-md bg-zinc-900 text-zinc-100 border-0">
      <div className="flex flex-col h-full">
        <CardHeader className="pb-2 border-b border-zinc-800">
          <CardTitle className="text-lg font-medium">{walletName}</CardTitle>
          <div className="text-sm text-zinc-400 break-all mt-1">
            {walletAddress}
          </div>
        </CardHeader>
        <CardContent className="flex-grow py-6">
          <div className="space-y-3">
            <div className="text-xs font-medium text-zinc-500 mb-2">HINTS</div>
            <div>
              <div className='font-light text-zinc-500 text-xs'>PassPhrase Hint</div>
              <button className="w-full group flex items-center justify-between rounded-lg bg-zinc-800/50 p-3 text-left transition-colors hover:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-zinc-700">
                    <KeyRound className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-100">
                    {passphraseHint}
                  </div>
                </div>
              </button>
            </div>
            <div>
              <div className='font-light text-zinc-500 text-xs'>Derivation Path Hint</div>
              <button className="w-full group flex items-center justify-between rounded-lg bg-zinc-800/50 p-3 text-left transition-colors hover:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-zinc-700">
                    <Keyboard className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="text-sm text-zinc-100">
                    {derivationPathHint}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}