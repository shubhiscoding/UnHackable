"use client"

import React from 'react'
import { useState } from 'react'
import Navbar from '../components/NavBar'
import IntroSection from '../components/Intro'
import { BackgroundBeams } from '@/components/ui/background-beams'

import GenerateKeypairForm from "@/components/generate-keypair";
import RecoverPrivateKeyForm from "@/components/recover-private-key";
import { Card } from '@/components/ui/card'
import { MessageSquareWarning } from 'lucide-react'

export default function Home() {
  const [mode, setMode] = useState("Generate KeyPair");
  const [publicKey, setPublicKey] = useState("");
  const [generated, setGenerated] = useState("");
  const [guestUser, setGuestUser] = useState(false);
  return (
      <div className="min-h-screen bg-neutral-950 text-zinc-400">
        {guestUser && <Navbar mode={mode} setMode={setMode} />}

        {!guestUser && <IntroSection guestUser={guestUser} setGuestUser={setGuestUser}/>}

        {guestUser && 
          <div className='flex flex-col justify-center items-center w-full min-h-screen'>
            <h1 
            className="text-lg md:text-7xl 
            bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 
            text-center font-sans font-bold mt-12 mb-2 max-md:hidden">
              {mode}
            </h1>
            <div className='relative z-0 flex justify-center items-center w-full max-w-3xl md:z-10 max-md:p-2 max-md:mt-16'>
            {mode =="Recover PrivateKey" && <RecoverPrivateKeyForm/>}

            {mode =="Generate KeyPair" && <GenerateKeypairForm publicKey={publicKey} setPublicKey={setPublicKey} guestUser={true}/>}
            
            {mode =="Support UnHackable"&&
              <div className="flex w-full p-4 md:p-6 justify-center">
                <Card className="flex flex-col text-center max-w-full md:max-w-fit w-full bg-zinc-900 text-zinc-100 border-0 p-4 md:p-6 justify-evenly gap-3 md:gap-5">
                  <div className="text-sm md:text-base">
                    If you find UnHackables useful, please consider supporting the project by donating to the following address:
                  </div>
                  <div className="text-xs md:text-sm break-all">
                    8vG8mxWEn8bmpBxh2QAEjoL2wUWbUSsyRqMx82zKKNMq
                  </div>
                </Card>
              </div>
            }
            </div>

            { mode != "Support UnHackable" &&
              <button className="rounded-full bg-zinc-800 px-2 py-1 text-left transition-colors hover:bg-zinc-800 md:mt-4">
                <div className="flex items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-zinc-700 max-md:mr-2">
                    <MessageSquareWarning className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="text-sm text-zinc-100">
                    Login to use features like saving Hints for Passphrase, derivation Path and much more for Free!
                </div>
                </div>
              </button>
            }
          </div>
        }
        <BackgroundBeams className={`${guestUser? "max-md:hidden": "block"}`} />
      </div>
  )
}