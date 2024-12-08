"use client";
import { signIn, useSession } from "next-auth/react"
import CustomSidebar from "@/components/app-sidebar";
import TopBar from "@/components/topBar";
import SavedHints from "@/components/saved-hints";
import BalanceCard from "@/components/balance-card";
import GenerateKeypairForm from "@/components/generate-keypair";
import RecoverPrivateKeyForm from "@/components/recover-private-key";
import WalletInfoCard from "@/components/show-hint";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
    const session = useSession()
    const [title, setTitle] = useState("Generate Wallet");
    const [publicKey, setPublicKey] = useState("");
    const [wallets, setWallets] = useState([]);
    const [walletName, setWalletName] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [generated, setGenerated] = useState("");

    useEffect(() => {
        if(session.data?.user?.email){
            const email = session.data?.user?.email;
            fetch('/api/wallets', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
              })
              .then(res => res.json())
              .then(data => {
                let reverseData = data.reverse();
                setPublicKey(reverseData[0].address);
                setWalletName(reverseData[0].name);
                setCreatedAt(reverseData[0].created);
                setWallets(reverseData);
              })
        }
    }, [session.data?.user?.email, generated]);


    if(session.data && session.data.user && session.data.user.image){
        return (
            <>
                <div className="flex min-h-screen bg-[rgb(50,51,50)]">
                    <CustomSidebar title={title} setTitle={setTitle}/>
                    <div className="flex-col h-full w-full">
                        <TopBar title={title} image={session.data.user.image}/>
                        {title == "Generate Wallet" || title == "Recover Wallet" ? 
                            (<div className="flex-col h-full p-6 w-full space-y-5">
                                <div className="flex justify-evenly px-5 gap-5 w-full">
                                    {title == "Recover Wallet" ? <RecoverPrivateKeyForm/>: <GenerateKeypairForm publicKey={publicKey} setPublicKey={setPublicKey} setGenerated={setGenerated} guestUser={false}/>}
                                    <WalletInfoCard walletAddress={publicKey} setCreatedAt={setCreatedAt} createdAt={createdAt} walletName={walletName} setWalletName={setWalletName}/>
                                </div>
                                <div className="flex justify-evenly px-5 gap-5 w-full">
                                    <SavedHints title={title} Hint={wallets} publicKey={publicKey} setPublicKey={setPublicKey}/>
                                    <BalanceCard walletAddress={publicKey} walletName={walletName} createdAt={createdAt}/>
                                </div>
                            </div>):<></>
                        }
                        {
                            title == "My Wallets" ?(
                                <div className="flex h-min p-6 justify-evenly gap-5">
                                    <SavedHints title={title} Hint={wallets} publicKey={publicKey} setPublicKey={setPublicKey}/>
                                    <div className="flex flex-col h-Screen justify-start gap-5">
                                        <WalletInfoCard walletAddress={publicKey} setCreatedAt={setCreatedAt} createdAt={createdAt} walletName={walletName} setWalletName={setWalletName}/>
                                        <BalanceCard walletAddress={publicKey} walletName={walletName} createdAt={createdAt}/>
                                    </div>
                                </div>
                            ):<></>
                        }
                        {
                            title == "Protfolio" ?(
                                <div className="flex h-min p-6 justify-evenly gap-5">
                                    <Card className="flex w-max bg-zinc-900 text-zinc-100 border-0 p-6 justify-evenly gap-5">
                                        Comming Soon!
                                    </Card>
                                </div>
                            ):<></>
                        }
                        {
                            title == "Support UnHackable" ?(
                                <div className="flex h-min p-6 justify-evenly gap-5">
                                    <Card className="flex w-max bg-zinc-900 text-zinc-100 border-0 p-6 justify-evenly gap-5">
                                        If you find UnHackables useful, please consider supporting the project by donating to the following address:
                                        8vG8mxWEn8bmpBxh2QAEjoL2wUWbUSsyRqMx82zKKNMq
                                    </Card>
                                </div>
                            ):<></>
                        }
                    </div>
                </div>
            </>
        )
    }else{
        return(
            <div className="flex flex-col justify-center items-center min-h-screen bg-[rgb(50,51,50)] text-zinc-400">
                <h1>Please LogIn</h1>
                <button className="px-8 py-2 rounded-full bg-zinc-400 text-zinc-800" onClick={() => signIn('google')}>Login</button>
            </div>
        );
    }
};

export default Dashboard;