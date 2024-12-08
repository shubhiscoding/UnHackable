import prisma from '@/lib/prisma';
export async function createUser(email: string) {
    const user = await prisma.user.create({
        data: {
        email,
        },
    });

    return user;
};

export async function getUser(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user;
};

export async function getWallets(email: string) {
    const wallets = await prisma.walletAddress.findMany({
        where: {
        user: {
            email,
        },
        },
    });
    
    return wallets;
};

export async function getWallet(address: string) {
    const wallet = await prisma.walletAddress.findUnique({
        where: { address },
    });

    return wallet;
}

export async function createWallet(email: string, address: string, passphraseHint: string, derivationPathHint: string, name: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return null;
    }

    const newWallet = await prisma.walletAddress.create({
        data: {
        address,
        passphraseHint,
        derivationPathHint,
        name,
        created: new Date(),
        user: {
            connect: { id: user.id },
        },
        },
    });

    return newWallet;
}