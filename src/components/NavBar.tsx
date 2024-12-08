"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import { Sun } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
interface navBarProps{
  mode: string;
  setMode: (mode: string) => void;
}
export default function Navbar(navBarProps: navBarProps) {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const {mode, setMode} = navBarProps;
  const {status} = useSession();
  const navItems = [
    { name: "Generate KeyPair", href: "#" },
    { name: "Recover PrivateKey", href: "#" },
    { name: "Support UnHackable", href: "#" },
  ]

  const handleClick = (name: string) => {
    setMode(name);
  }

  return (
    <div className='flex justify-center relative z-10'>
      <nav className="fixed flex items-center justify-between px-2 py-2 bg-black text-white rounded-full w-auto top-2 self-center">
        <div className="flex items-center space-x-2 ml-1">
          <Sun className="w-6 h-6 text-orange-500" />
          <span className="font-semibold">UnHackable</span>
        </div>
        <div className="flex space-x-8 mx-6">
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
        {status ==="authenticated"? 
        (<button className="bg-white text-black px-6 py-2 rounded-full" onClick={() => signOut()}>
          Log Out
        </button>):
        (<button className="bg-white text-black px-6 py-2 rounded-full" onClick={() => signIn('google')}>
          Login
        </button>)
        }
      </nav>
    </div>
  )
}