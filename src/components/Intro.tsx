"use client";
import { signIn, useSession } from "next-auth/react";
import { MessageSquareWarning, ArrowRightCircle } from "lucide-react";
import { useEffect } from "react";

interface IntroSectionProps {
    guestUser: boolean;
    setGuestUser: (value: boolean) => void;
}

const IntroSection = (prop: IntroSectionProps) => {
    const { guestUser, setGuestUser } = prop;
    const session = useSession();

    const handleClick = () => {
        if (session.data?.user) {
            window.location.href = "/dashboard";
        } else {
            signIn("google");
        }
    };

    useEffect(() => {
        if (session.data?.user) {
            window.location.href = "/dashboard";
        }
    }, [session]);

    return (
        <div className="flex flex-col justify-center items-center text-center px-4 relative z-10 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-bold font-sans leading-tight">
                    Create A Wallet
                    <br />
                    With Extra Security Layer
                    <br />
                    For Your Private Key
                </h1>

                {/* Subtext */}
                <p className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 text-base sm:text-lg md:text-xl mt-6 mb-4 max-w-2xl mx-auto">
                    Add an extra layer of security to your wallet by adding a passphrase and derivation path to your private key.
                </p>

                {/* Informational Button */}
                <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-800 text-left hover:bg-zinc-700 mb-6 max-w-md mx-auto">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                        <MessageSquareWarning className="h-6 w-6 text-zinc-400" />
                    </div>
                    <span className="text-sm text-zinc-100">
                        Login to use features like saving hints for Passphrase, Derivation Path, and much more for free!
                    </span>
                </button>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    {/* Login Button */}
                    <button
                        className="w-full sm:w-auto bg-zinc-100 text-zinc-700 px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-200"
                        onClick={handleClick}
                    >
                        {session.data?.user ? "Launch App" : "Login and Continue"}
                    </button>

                    {/* Guest Button */}
                    <button
                        className="w-full sm:w-auto flex items-center justify-center gap-3 text-zinc-100 px-8 py-3 rounded-full border-2 border-zinc-700 bg-zinc-900 cursor-pointer hover:bg-zinc-800"
                        onClick={() => {
                            setGuestUser(true);
                        }}
                    >
                        Continue Without Login
                        <ArrowRightCircle className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroSection;