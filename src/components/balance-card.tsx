"use client"

import { ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

interface BalanceCardProps {
  walletName: string
  walletAddress: string
  createdAt: string
}

export default function BalanceCard(prop: BalanceCardProps) {
  const { walletName, walletAddress, createdAt } = prop;
  const connection = new Connection(clusterApiUrl('mainnet-beta'));
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if(walletAddress){
      const addr = new PublicKey(walletAddress);
      console.log(walletAddress);
      connection.getBalance(addr).then((balance) => {
        setBalance(balance / 1000000000);
      });
    }
  }, [walletAddress]);

  const handleViewExplorer = () => {
    window.open(`https://solscan.io/account/${walletAddress}`, '_blank')
  }

  return (
    <Card className="w-full max-w-md bg-zinc-900 text-zinc-100 border-0">
      <div className="flex flex-col h-full">
        <CardHeader className="pb-2 border-b border-zinc-800">
          <CardTitle className="text-lg font-medium">{walletName}</CardTitle>
          <div className="text-sm text-zinc-400 break-all mt-1">
            {walletAddress}
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center py-6">
          <div className="space-y-5">
            <div>
              <div className="text-xs text-zinc-500">Balance</div>
              <div className="text-2xl font-bold">
                {balance.toFixed(4)} SOL
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">
                Created at · {(new Date(createdAt)).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              onClick={handleViewExplorer}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View in Explorer
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}