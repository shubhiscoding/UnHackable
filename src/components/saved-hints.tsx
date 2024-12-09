"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedHintsProps {
  title: string,
  Hint: Array<{
          address: string;
          id: string;
          name: string;
          passphraseHint: string | null;
          derivationPathHint: string | null;
          created: Date;
          userId: string;
      }>,
  publicKey: string,
  setPublicKey: (publicKey: string) => void
}

export default function SavedHints(prop: SavedHintsProps) {
  const hints = prop.Hint;
  const {publicKey, setPublicKey} = prop;

  return (
    <div className="rounded-xl w-full bg-zinc-900 p-4 xl:p-6">
      <div className="mb-4 flex flex-col xl:flex-row items-start xl:items-center justify-between">
        <h1 className="text-lg xl:text-xl font-medium text-zinc-100 mb-2 xl:mb-0">Saved Wallets</h1>
      </div>
      {/* Scrollable container */}
      <div className={`space-y-3 xl:space-y-4 overflow-y-auto ${prop.title == "My Wallets" ? "max-h-[75vh] max-xl:max-h-[50vh]": "max-h-[17rem] max-md:max-h-[17rem] max-xl:max-h-[30rem]"} custom-scrollbar`}>
        {hints.map((hint) => (
          <div
            key={hint.id}
            className="flex flex-col xl:flex-row items-start xl:items-center justify-between rounded-lg bg-zinc-800/50 p-3 hover:bg-zinc-800 space-y-2 xl:space-y-0"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 flex-shrink-0">
                <Wallet className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-xl font-medium text-zinc-100 truncate">
                  {hint.name}
                </div>
                {hint.created && (
                  <div className="text-xs text-zinc-500 truncate">
                    Created at · {(new Date(hint.created)).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-2 xl:gap-3 w-full xl:w-auto">
              <span className="text-xl text-zinc-400 truncate max-w-full">
                {hint.address}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="w-full xl:w-auto h-7 bg-zinc-800 text-xs font-medium text-zinc-100 hover:bg-zinc-700 hover:text-zinc-50"
                onClick={() => setPublicKey(hint.address)}
              >
                View Hint
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}