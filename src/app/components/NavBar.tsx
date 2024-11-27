"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Shield } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sun } from 'lucide-react'
export default function Navbar() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Support", href: "#" },
  ]

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-black text-white rounded-full mx-8 mt-8">
        <div className="flex items-center space-x-2">
          <Sun className="w-6 h-6 text-orange-500" />
          <span className="font-semibold">UnHackable</span>
        </div>
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => setShowComingSoon(true)}
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.name}
            </Button>
          ))}
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-full">
          Login
        </button>
      </nav>
      <AlertDialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-white">
          <div className="flex flex-col items-center text-center p-4">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse blur-xl opacity-50" />
              <div className="relative bg-black/50 rounded-full p-3 backdrop-blur-sm border border-gray-800">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Coming Soon
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 mt-2">
              This feature is currently under development. Stay tuned for updates!
            </AlertDialogDescription>
            <AlertDialogAction 
              className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-2 rounded-lg transition-all duration-200"
              onClick={() => setShowComingSoon(false)}
            >
              Got it
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}