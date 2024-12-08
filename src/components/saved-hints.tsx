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
    <div className="rounded-xl w-full bg-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-l font-semibold text-zinc-100 mb-1">{prop.title}</h1>
      </div>
      {/* Scrollable container */}
      <div className={`space-y-4 overflow-y-auto ${prop.title == "My Wallets" ? "max-h-[75vh]": "max-h-[17rem]"} custom-scrollbar`}>
        {hints.map((hint) => (
          <div
            key={hint.id}
            className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-3 hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700">
                <Wallet className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-100">
                  {hint.name}
                </div>
                {hint.created && (
                  <div className="text-xs text-zinc-500">
                    Created at · {(new Date(hint.created)).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">
                {hint.address}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 bg-zinc-800 text-xs font-medium text-zinc-100 hover:bg-zinc-700 hover:text-zinc-50"
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