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
                            (<div className="flex-col h-full p-6 w-full space-y-3 max-md:p-2 max-xl:mt-[4.8rem]">
                                <div className="flex max-md:flex-col justify-evenly px-5 gap-5 w-full max-md:px-0">
                                    {title == "Recover Wallet" ? <RecoverPrivateKeyForm/>: <GenerateKeypairForm publicKey={publicKey} setPublicKey={setPublicKey} setGenerated={setGenerated} guestUser={false}/>}
                                    <WalletInfoCard walletAddress={publicKey} setCreatedAt={setCreatedAt} createdAt={createdAt} walletName={walletName} setWalletName={setWalletName}/>
                                </div>
                                <div className="flex max-xl:flex-col justify-evenly px-5 gap-5 w-full max-md:px-0">
                                    <SavedHints title={title} Hint={wallets} publicKey={publicKey} setPublicKey={setPublicKey}/>
                                    {window.innerWidth > 1024 && <BalanceCard walletAddress={publicKey} walletName={walletName} createdAt={createdAt}/>}
                                </div>
                            </div>):<></>
                        }
                        {
                            title == "My Wallets" ?(
                                <div className="flex h-min p-6 justify-evenly gap-5 max-xl:flex-col max-xl:mt-16 max-md:px-2">
                                    <SavedHints title={title} Hint={wallets} publicKey={publicKey} setPublicKey={setPublicKey}/>
                                    <div className="flex flex-col h-Screen justify-start gap-5 max-xl:flex-row max-md:flex-col">
                                        <WalletInfoCard walletAddress={publicKey} setCreatedAt={setCreatedAt} createdAt={createdAt} walletName={walletName} setWalletName={setWalletName}/>
                                        <BalanceCard walletAddress={publicKey} walletName={walletName} createdAt={createdAt}/>
                                    </div>
                                </div>
                            ):<></>
                        }
                        {
                            title == "Protfolio" ?(
                                <div className="flex h-min p-6 justify-evenly gap-5 max-xl:mt-16">
                                    <Card className="flex w-max bg-zinc-900 text-zinc-100 border-0 p-6 justify-evenly gap-5">
                                        Coming Soon!
                                    </Card>
                                </div>
                            ):<></>
                        }
                        {
                            title == "Support UnHackable" ?(
                                <div className="flex w-full p-4 md:p-6 justify-center max-xl:mt-20">
                                  <Card className="flex flex-col text-center max-w-full md:max-w-fit w-full bg-zinc-900 text-zinc-100 border-0 p-4 md:p-6 justify-evenly gap-3 md:gap-5">
                                    <div className="text-sm md:text-base">
                                      If you find UnHackables useful, please consider supporting the project by donating to the following address:
                                    </div>
                                    <div className="text-xs md:text-xl break-all">
                                      8twrkXxvDzuUezvbkgg3LxpTEZ59KiFx2VxPFDkucLk3
                                    </div>
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