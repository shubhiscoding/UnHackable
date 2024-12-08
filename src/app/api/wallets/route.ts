import { getUser, getWallets } from "@/lib/dbOperations";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await getUser(email);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const wallets = await getWallets(email);

    return NextResponse.json(wallets, { status: 200 });
}