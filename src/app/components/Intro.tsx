const IntroSection = () =>{
    return(
        <div className="text-center mt-20 mb-12 px-4">
            <div className="inline-block bg-white px-4 py-1 rounded-full text-sm mb-6">
            Make Your Wallets UnHackable!
            </div>
            <h1 className="text-6xl font-bold leading-tight mb-6">
            Create A Wallet
            <br />
            With Extra Security Layer
            <br />
            For Your Private Key
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Add extra layer of security to your wallet by adding a passphrase and derivation path to your private key.
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-full">
            Get Started
            </button>
        </div>
    );
}

export default IntroSection;