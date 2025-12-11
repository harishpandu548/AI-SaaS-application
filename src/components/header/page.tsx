"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

function Header() {
    const {data:session}=useSession()
    const plan=session?.user?.plan || "FREE"
    const credits=session?.user?.credits || "-"
    console.log(plan,credits)
  return (
     <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">SaaS AI</Link>

        <nav className="flex items-center gap-4">
          <Link href="/pricing" className="px-3 py-1 rounded hover:bg-slate-100">Pricing</Link>
          <Link href="/dashboard" className="px-3 py-1 rounded hover:bg-slate-100">Dashboard</Link>

          <div className="flex items-center gap-3">
            <div title={`Plan: ${plan}`} className="px-2 py-1 rounded-full bg-slate-100 text-sm">
              {plan}
            </div>
            <div title={`Credits`} className="px-2 py-1 rounded-full bg-slate-100 text-sm">
              {credits} 💎
            </div>
            {session ? (
              <Link href="/api/auth/signout" className="text-sm">Logout</Link>
            ) : (
              <Link href="/api/auth/signin" className="text-sm">Login</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
