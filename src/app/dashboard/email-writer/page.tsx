import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import EmailWriterClient from './client'

async function EmailWriterPage() {
    const session=await getServerAuthSession()
    if(!session) redirect("/")
  return (
    <div>
        <EmailWriterClient/>
    </div>
  )
}

export default EmailWriterPage
