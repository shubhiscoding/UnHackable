import NextAuth from 'next-auth'
import { authOptions } from '@/lib/authOptions'
const {handlers} = NextAuth(authOptions)

export const {GET, POST} = handlers;