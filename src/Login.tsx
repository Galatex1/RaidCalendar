import { DiscordLogo } from '@phosphor-icons/react/dist/ssr'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from './App'

export default function Login() {

    const { } = useContext(AuthContext)

    return (
        <div className='h-screen w-full bg-slate-900 flex flex-col gap-8px text-white font-sans p-64px py-32px relative overflow-hidden items-stretch'>
            <a href='https://discord.com/api/oauth2/authorize?client_id=1162065374561443962&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F&response_type=token&scope=guilds%20identify' className='inline-flex w-max rounded items-center gap-12px text-white p-8px bg-[#5865f2]'><DiscordLogo size={24} /> Login with Discord</a>
        </div>
    )
}
