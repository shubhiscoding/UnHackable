"use client"
import { useState, useEffect } from 'react'
import { Keypair } from '@solana/web3.js'
import * as bip39 from 'bip39'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Shield, Lock, Key, Eye, EyeOff, Wallet, RefreshCw } from 'lucide-react'
import { derivePath } from '@/lib/utils'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'

export default function RecoverPrivateKey() {
  const [passphrase, setPassphrase] = useState('')
  const [derivationPath, setDerivationPath] = useState("m/44'/501'/0'/0'")
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [seedPhrase, setSeedPhrase] = useState('')
  const [error, setError] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const session = useSession();

  const generateKeypair = async (e) => {
    e.preventDefault()
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
      <div className="max-w-6xl mx-auto bg-white/80 rounded-2xl shadow-xl p-4 mt-12 ">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white/70 via-red-50 to-pink-50">
          
          <CardHeader className="relative space-y-1 text-center pb-8">
            <div className="mx-auto w-16 h-16 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r  bg-black/50 rounded-full p-4 backdrop-blur-sm border border-gray-800 animate-pulse blur-xl opacity-50" />
              <div className="relative bg-black rounded-full p-4 backdrop-blur-sm border border-gray-800">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold">
              Recover Private Key
            </CardTitle>
            <CardDescription className="text-[#5e6672] text-lg">
              Generate your Solana keypair with advanced security
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6 p-6">
            <form onSubmit={generateKeypair} className="space-y-2">
              <div className="space-y-4">
                {/* <Label className="text-black/50 flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4" /> BIP39 Mnemonic Passphrase
                </Label> */}
                <div className="relative group">
                  {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition" /> */}
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
                  {/* <Label className="text-black/50 flex items-center gap-2 text-sm">
                    <Key className="w-4 h-4" /> Derivation Path
                  </Label> */}
                  <div className="relative group">
                    {/* <div className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-50 transition" /> */}
                    <Input
                      type='text'
                      value={derivationPath}
                      onChange={(e) => setDerivationPath(e.target.value)}
                      className="border-black/20 text-black/55 placeholder-black pr-10 rounded-xl"
                      placeholder="Enter Derivation Path(e.g. m/44'/501'/0'/0')"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* <Label className="text-black/50 flex items-center gap-2 text-sm">
                    <Key className="w-4 h-4" /> Derivation Path
                  </Label> */}
                  <div className="relative group">
                    {/* <div className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-50 transition" /> */}
                    <Textarea
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      className="border-black/20 text-black/55 placeholder-black pr-10 rounded-xl"
                      placeholder="Seed Phrase"
                    />
                  </div>
                </div>
              </div>
              {/* w-full bg-black hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-200 rounded-full */}
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
                      Recover Keypair
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
            {session.status != "authenticated" ? (
              <Button
                onClick={async() => {
                  await signIn('google')
                }}
                className="w-full bg-black hover:bg-black/80 text-white backdrop-blur-sm transition-all duration-200 rounded-full"
              >
                Sign in to Save Hints
              </Button>
            ) : (
              <div className="w-full flex items-center justify-between gap-4 text-gray-400">
                <span>Signed in as {session.data?.user?.email}</span>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
  )
}