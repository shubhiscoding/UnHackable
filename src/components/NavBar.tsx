"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LockIcon, Menu, X } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'

interface NavbarProps {
  mode: string;
  setMode: (mode: string) => void;
}

export default function Navbar({ mode, setMode }: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { status } = useSession();

  const navItems = [
    { name: "Generate KeyPair", href: "#" },
    { name: "Recover PrivateKey", href: "#" },
    { name: "Support UnHackable", href: "#" },
  ]

  const handleClick = (name: string) => {
    setMode(name);
    setShowMobileMenu(false);
  }

  return (
    <div className='flex justify-center relative z-10'>
      <nav className="fixed flex items-center justify-between px-4 py-2 bg-black text-white rounded-full md:w-auto w-full max-w-6xl top-2 self-center z-50">
        <div className="flex items-center space-x-2">
          <div className="flex justify-center items-center p-[0.4rem] w-8 h-8 bg-zinc-800 rounded-full overflow-hidden">
            <LockIcon className="w-6 h-6" />
          </div>
          <span className="font-semibold">UnHackable</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 mx-3">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => handleClick(item.name)}
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-full"
            >
              {item.name}
            </Button>
          ))}
        </div>

        {/* Login/Logout Button */}
        <div className="hidden md:block">
          {status === "authenticated" ? (
            <button className="bg-white text-black px-6 py-2 rounded-full" onClick={() => signOut()}>
              Log Out
            </button>
          ) : (
            <button className="bg-white text-black px-6 py-2 rounded-full" onClick={() => signIn('google')}>
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]">
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-zinc-900 p-4 overflow-y-auto z-[70]">
            <div className="flex justify-end">
              <button onClick={() => setShowMobileMenu(false)}>
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="mt-8 space-y-4">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleClick(item.name)}
                  className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.name}
                </Button>
              ))}
              {status === "authenticated" ? (
                <button className="w-full bg-white text-black px-6 py-2 rounded-full" onClick={() => signOut()}>
                  Log Out
                </button>
              ) : (
                <button className="w-full bg-white text-black px-6 py-2 rounded-full" onClick={() => signIn('google')}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}