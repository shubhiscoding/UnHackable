"use client"
import { useState } from 'react'
import { Eye, EyeOff, Key, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSession } from 'next-auth/react'
import * as bip39 from 'bip39'
import { derivePath } from '@/lib/utils'
import { Keypair } from '@solana/web3.js'

export default function RecoverPrivateKeyForm() {
  const [passphrase, setPassphrase] = useState('')
  const [derivationPath, setDerivationPath] = useState("m/44'/501'/0'/0'")
  const [seedPhrase, setSeedPhrase] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')

  const [error, setError] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const session = useSession();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    console.log('Generating private key with:', { passphrase, derivationPath, seedPhrase })
    setError('')
    setPublicKey('')
    setIsGenerating(true)

    try {
      const seed = await bip39.mnemonicToSeed(seedPhrase, passphrase)
      const derivedSeed = derivePath(derivationPath, seed.toString('hex')).data.key
      const keypair = Keypair.fromSeed(Uint8Array.from(derivedSeed))
      setPublicKey(keypair.publicKey.toString())
      setPrivateKey(Buffer.from(keypair.secretKey).toString('hex'))
    } catch (err) {
      console.log(err);
      setError('Error generating keypair. Please check your inputs.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full bg-zinc-900 text-zinc-100 border-0">
      <CardHeader className="pb-4 border-b border-zinc-800">
        <CardTitle className="text-lg font-medium">Recover Private Key</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div className="space-y-2 relative">
            <Label htmlFor="passphrase">Enter Passphrase</Label>
            <Input
              id="passphrase"
              type={showPassphrase ? 'text' : 'password'}
              placeholder="Enter your passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute inset-y-10 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-400"
            >
              {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="derivationPath">Enter Derivation Path</Label>
            <Input
              id="derivationPath"
              placeholder="m/44'/501'/0'/0'"
              value={derivationPath}
              onChange={(e) => setDerivationPath(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seedPhrase">Enter Seed Phrase</Label>
            <Textarea
              id="seedPhrase"
              placeholder="Enter your 12 or 24-word seed phrase"
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 min-h-[60px]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                <Key className="mr-2 h-4 w-4" />
                Recover Private Key
                </>
              )}
            </span>
          </Button>
        </form>
        {publicKey && privateKey && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-800 backdrop-blur-sm">
              <Label className="text-purple-400 font-medium mb-2 block">Generated Public Key</Label>
              <p className="font-mono text-sm break-all text-gray-300">{publicKey}</p>
              <br />
              <Label className="text-purple-400 font-medium mb-2 block">Private Key</Label>
              <p className="font-mono text-sm break-all text-gray-300">{privateKey}</p>
              <br />
              <Label className="text-purple-400 font-medium mb-2 block">Seed Phrase</Label>
              <p className="font-mono text-sm break-all text-gray-300">{seedPhrase}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-zinc-500">
          Support this project: 8twrkXxvDzuUezvbkgg3LxpTEZ59KiFx2VxPFDkucLk3
        </p>
      </CardFooter>
    </Card>
  )
}

