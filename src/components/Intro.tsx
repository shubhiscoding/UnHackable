"use client";
import { signIn, useSession } from "next-auth/react";
import { MessageSquareWarning, ArrowRightCircle, KeyRound } from "lucide-react";
import { useEffect } from "react";

interface IntroSectionProps {
    guestUser: boolean;
    setGuestUser: (value: boolean) => void;
}

const IntroSection = (prop: IntroSectionProps) =>{
    const {guestUser, setGuestUser} = prop;
    const session = useSession();
    const handleClick = () => {
        if(session.data?.user){
            window.location.href = "/dashboard";
        }else{
            signIn("google");
        }
    }

    useEffect(() => {
        if(session.data?.user){
            window.location.href = "/dashboard";
        }
    }, [session]);

    return(
        <div className="flex flex-col justify-center items-center text-center px-4 relative z-10 min-h-[100vh]">
            <div>
                <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
                Create A Wallet
                <br />
                With Extra Security Layer
                <br />
                For Your Private Key
                </h1>
                <p className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 text-lg mt-8 mb-2 max-w-2xl mx-auto">
                Add extra layer of security to your wallet by adding a passphrase and derivation path to your private key.
                </p>
                <button className="rounded-full bg-zinc-800 px-2 py-1 text-left transition-colors hover:bg-zinc-800 mb-8">
                    <div className="flex items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-zinc-700">
                        <MessageSquareWarning className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-100">
                        Login to use features like saving Hints for Passphrase, derivation Path and much more for Free!
                    </div>
                    </div>
                </button>
                <div className="flex justify-center gap-x-3 mt-3">
                    <button className="bg-zinc-100 text-zinc-700 px-8 py-3 rounded-full cursor-pointer" onClick={handleClick}>
                    {session.data?.user ? "Launch App": "Login and Continue"}
                    </button>
                    <button className="flex gap-x-3 text-zinc-100 px-8 py-3 rounded-full border-zinc-700 bg-zinc-900 border-2 cursor-pointer" onClick={()=>{setGuestUser(true)}}>
                        Continue Without Login <ArrowRightCircle />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IntroSection;