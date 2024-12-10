"use client"

import { useState } from 'react'
import { Eye, EyeOff, Key, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as bip39 from 'bip39'
import { derivePath, parseDerivationPath } from '@/lib/utils'
import { Keypair } from '@solana/web3.js'
import { useSession } from 'next-auth/react'
import { getUser } from '@/lib/dbOperations'


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

interface GenerateKeypairFormProps {
  publicKey: string;
  setPublicKey: (publickey: string) => void;
  setGenerated?: (generated: string) => void;
  guestUser?: boolean;
}

export default function GenerateKeypairForm(prop: GenerateKeypairFormProps) {
  const [passphrase, setPassphrase] = useState('')
  const [passphraseHint, setPassphraseHint] = useState('')
  const [derivationPath, setDerivationPath] = useState("m/44'/501'/0'/0'")
  const [derivationPathHint, setDerivationPathHint] = useState('')
  const [walletName, setWalletName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const [showPassphrase, setShowPassphrase] = useState(false)
  const {publicKey, setPublicKey} = prop;
  const  {setGenerated} = prop;
  const [privateKey, setPrivateKey] = useState('')
  const [seedPhrase, setSeedPhrase] = useState('')
  const [parsedDerivationPath, setParsedDerivationPath] = useState('')

  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const session = useSession();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    console.log('Generating KeyPair with:', { passphrase, passphraseHint, derivationPath, derivationPathHint, walletName })
    try {
      const mem = bip39.generateMnemonic()
      const seed = await bip39.mnemonicToSeed(mem, passphrase)

      const { isValid, error } = validateDerivationPath(derivationPath, seed);

      if(error){
        console.log(error);
      }else{
        console.log('valid');
      }
      const derivedData = derivePath(derivationPath, seed.toString('hex'));
      const derivedSeed = derivedData.data.key;
      setParsedDerivationPath(derivedData.parsedPath);
      const keypair = Keypair.fromSeed(Uint8Array.from(derivedSeed))
      console.log({
        publicKey: keypair.publicKey.toString(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
        seedPhrase: mem
      })
      setPublicKey(keypair.publicKey.toString())
      if(setGenerated){
        setGenerated(keypair.publicKey.toString());
      }
      setWalletAddress(keypair.publicKey.toString());
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
            body: JSON.stringify({ email, address: keypair.publicKey.toString(), passphraseHint, derivationPathHint, name: walletName })
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

  return (
    <Card className="w-full bg-zinc-900 text-zinc-100 border-0">
      <CardHeader className="pb-4 border-b border-zinc-800">
        <CardTitle className="text-lg font-medium">Generate KeyPair</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <Label htmlFor="passphrase">Passphrase</Label>
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
              <Label htmlFor="passphraseHint">Passphrase Hint</Label>
              <Input
                id="passphraseHint"
                placeholder={!prop.guestUser?"Enter a hint for your passphrase" : "Login to save passphrase hint"}
                value={passphraseHint}
                disabled={prop.guestUser}
                onChange={(e) => setPassphraseHint(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="derivationPath">Derivation Path</Label>
              <Input
                id="derivationPath"
                placeholder="m/44'/501'/0'/0'"
                value={derivationPath}
                onChange={(e) => setDerivationPath(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              />
              <p className='text-zinc-400 text-xs'>This how it's parsed: {parseDerivationPath(derivationPath)}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="derivationPathHint">Derivation Path Hint</Label>
              <Input
                id="derivationPathHint"
                placeholder={!prop.guestUser?"Enter a hint for your derivation path":"Login to save derivation path hint"}
                value={derivationPathHint}
                disabled={prop.guestUser}
                onChange={(e) => setDerivationPathHint(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletName">Wallet Name</Label>
            <Input
              id="walletName"
              placeholder={!prop.guestUser?"Enter a name for your wallet": "Login to save wallet Name"}
              value={walletName}
              disabled={prop.guestUser}
              onChange={(e) => setWalletName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400"
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
                  {!prop.guestUser ? "Save Hints and Generate KeyPair": "Generate KeyPair"}
                </>
              )}
            </span>
          </Button>
        </form>
          {walletAddress && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-800 backdrop-blur-sm">
              <Label className="text-purple-400 font-medium mb-2 block">Generated Public Key</Label>
              <p className="font-mono text-sm break-all text-gray-300">{walletAddress}</p>
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
          Support this project: EZWrterFqrNPJHfhtKizkMRGDLcDQsDALxBp8BikFW9r
        </p>
      </CardFooter>
    </Card>
  )
}