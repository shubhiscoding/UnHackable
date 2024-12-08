"use client"
import { useState } from 'react'
import { Keypair } from '@solana/web3.js'
import * as bip39 from 'bip39'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Key, Eye, EyeOff, Wallet, RefreshCw } from 'lucide-react'
import { derivePath } from '@/lib/utils'
import { signIn, useSession } from 'next-auth/react'
import { createUser, createWallet, getUser } from '@/lib/dbOperations'

export default function SolanaKeypairGenerator() {
  const [passphrase, setPassphrase] = useState('')
  const [derivationPath, setDerivationPath] = useState("m/44'/501'/0'/0'")
  const [passphraseHint, setPassphraseHint] = useState('')
  const [derivationPathHint, setDerivationPathHint] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [seedPhrase, setSeedPhrase] = useState('')
  const [error, setError] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const session = useSession();

  const generateKeypair = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError('')
    setPublicKey('')
    setIsGenerating(true)
    try {
      const mem = bip39.generateMnemonic()
      const seed = await bip39.mnemonicToSeed(mem, passphrase)

      const { isValid, error } = validateDerivationPath(derivationPath, seed);

      if(error){
        console.log(error);
      }else{
        console.log('valid');
      }
      const derivedSeed = derivePath(derivationPath, seed.toString('hex')).data.key
      
      const keypair = Keypair.fromSeed(Uint8Array.from(derivedSeed))

      setPublicKey(keypair.publicKey.toString())
      setPrivateKey(Buffer.from(keypair.secretKey).toString('hex'))
      setSeedPhrase(mem);

      //Saving Hints
        if(session){
          const email = session.data?.user?.email;
          const wallet = await fetch('/api/hints', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, address: keypair.publicKey.toString(), passphraseHint, derivationPathHint, name: 'Solana' })
          });
          const walletData = await wallet.json();
          console.log(walletData);
        }

    } catch (err:any) {
      console.log(err);
      setError('Error generating keypair. Please check your inputs.')
      if(err.message.includes('Invalid derivation path')) {
        setError('Invalid derivation path. Please check your inputs.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

function validateDerivationPath(derivationPath:string, seed: Buffer) {
  try {
    derivePath(derivationPath, seed.toString('hex')).data.key;
    return { isValid: true };
  } catch (err: any) {
    const message = parseDerivationPathError(derivationPath, err.message);
    return { isValid: false, error: message };
  }
}

function parseDerivationPathError(path:string, error:string) {
  if (!path) {
    return 'The derivation path is empty.';
  }

  if (!path.includes('/')) {
    return "The derivation path must use '/' as separators between levels.";
  }

  const segments = path.split('/');

  if(segments[segments.length - 1] === ''){
    return 'The derivation path must not end with a slash.';
  }

  if(segments[0] === ''){
    return 'The derivation path must not start with a slash.';
  }

  for (const segment of segments) {
    if (segment !== '') {
      return `The derivation path must not contain empty segments.`;
    }
  }

  for (const segment of segments) {
    if (!/^\d+'?$/.test(segment) && segment !== '') {
      return `Invalid segment '${segment}'. Each segment must be numeric, optionally followed by a single quote (e.g., "44'").`;
    }
  }

  if (!error.includes('Invalid')) {
    return `Invalid derivation path: ${error}`;
  }
  return `The derivation path '${path}' is invalid. Please ensure the format and levels are correct.`;
}


  return (
    <div className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-xl p-4 mt-12">
      <Card className="relative overflow-hidden bg-gradient-to-br from-white/70 via-red-50 to-pink-50">
        
        <CardHeader className="relative space-y-1 text-center pb-8">
          <div className="mx-auto w-16 h-16 mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r  bg-black/50 rounded-full p-4 backdrop-blur-sm border border-gray-800 animate-pulse blur-xl opacity-50" />
            <div className="relative bg-black rounded-full p-4 backdrop-blur-sm border border-gray-800">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">
            Secure Keypair Generator
          </CardTitle>
          <CardDescription className="text-[#5e6672] text-lg">
            Generate your Solana keypair with advanced security
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6 p-6">
          <form onSubmit={generateKeypair} className="space-y-2">
            <div className="space-y-4">
              <div className="relative group">
                <div className="relative">
                  <Input
                    type={showPassphrase ? "text" : "password"}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="border-black/20 text-black placeholder-black pr-10 rounded-xl"
                    placeholder="Enter your secure passphrase"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-400"
                  >
                    {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Input
                    type='text'
                    value={derivationPath}
                    onChange={(e) => setDerivationPath(e.target.value)}
                    className="border-black/20 text-black/55 placeholder-black pr-10 rounded-xl"
                    placeholder="Enter Derivation Path(e.g. m/44'/501'/0'/0')"
                  />
                </div>
              </div>
            </div>
            <Button 
              type="submit"
              disabled={isGenerating}
              className="w-full bg-black hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-200 rounded-full"
            >
              <span className="absolute inset-0" />
              <span className="relative flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Generate Secure Keypair
                  </>
                )}
              </span>
            </Button>
          </form>

          {publicKey && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-800 backdrop-blur-sm">
              <Label className="text-purple-400 font-medium mb-2 block">Generated Public Key</Label>
              <p className="font-mono text-sm break-all text-gray-300">{publicKey}</p>
              <br />
              <p className="font-mono text-sm break-all text-gray-300">{privateKey}</p>
              <br />
              <p className="font-mono text-sm break-all text-gray-300">{seedPhrase}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="relative flex flex-col gap-4 p-6 bg-gradient-to-b from-[#f1e5e8] to-white">
          {!session ? (
            <Button
              onClick={() => signIn('google')}
              className="w-full bg-black hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-200 rounded-full"
            >
              Sign in to Save Hints
            </Button>
          ) : (
            <div className="w-full flex-col space-y-3 items-center justify-between gap-4 text-gray-400">
              <div className="relative w-full">
                <Input
                  type={showPassphrase ? "text" : "password"}
                  value={passphraseHint}
                  onChange={(e) => setPassphraseHint(e.target.value)}
                  className="border-black/20 text-black placeholder-black pr-10 rounded-xl"
                  placeholder="Save Hint For Secure Passphrase"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-400"
                >
                  {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative w-full">
                <Input
                  type={showPassphrase ? "text" : "password"}
                  value={derivationPathHint}
                  onChange={(e) => setDerivationPathHint(e.target.value)}
                  className="border-black/20 text-black placeholder-black pr-10 rounded-xl"
                  placeholder="Save Hint For derivation Path!"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-400"
                >
                  {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}