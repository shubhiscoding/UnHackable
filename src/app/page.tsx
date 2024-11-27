"use client"
import React from 'react';
import { useState } from 'react';
import Navbar from './components/NavBar';
import IntroSection from './components/Intro';
import SolanaKeypairGenerator from './components/SolanaKeypairGenerator';
import RecoverPrivateKey from './components/RecoverPrivateKey';
import { SessionProvider } from "next-auth/react"
export default function Home() {
  const [recover, setRecover] = useState(true);
  return (
    <SessionProvider>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <IntroSection />

      {!recover?(<SolanaKeypairGenerator />): (<RecoverPrivateKey />)}

      {/* Logos */}
      <div className="flex justify-center items-center space-x-12 mt-20 mb-12">
        <span className="text-gray-400 font-bold">amazon</span>
        <span className="text-gray-400 font-bold">ATLASSIAN</span>
        <span className="text-gray-400 font-bold">GitHub</span>
        <span className="text-gray-400 font-bold">LaunchDarkly</span>
        <span className="text-gray-400 font-bold">NETFLIX</span>
        <span className="text-gray-400 font-bold">Medium</span>
      </div>
    </div>
    </SessionProvider>
  );
};