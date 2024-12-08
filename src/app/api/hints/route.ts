import { createUser, createWallet, getUser, getWallet, getWallets } from "@/lib/dbOperations";
import { NextResponse } from "next/server";
export async function POST(req: Request, res: NextResponse){
    const { email, address, passphraseHint, derivationPathHint, name } = await req.json();

    if (!email || !address) {
        return NextResponse.json({ message: 'Email and address are required' }, { status: 400 });
    }

    let user = await getUser(email);
    if (!user) {
        user = await createUser(email);
    }

    const newWallet = await createWallet(email, address, passphraseHint, derivationPathHint, name);

    if (!newWallet) {
        return NextResponse.json({ message: 'Failed to create wallet' }, { status: 500 });
    }

    return NextResponse.json(newWallet, { status: 201 });
};


export async function GET(req: Request, res: NextResponse){
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');
    if (!address) {
        return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 });
    }

    const wallet = await getWallet(address);

    if (!wallet) {
        return NextResponse.json({ message: 'Failed to get wallets' }, { status: 500 });
    }

    return NextResponse.json(wallet, { status: 200 });
};