import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import ContentGeneratorClient from './client'

async function CaptionGeneratorPage() {
    const session=await getServerAuthSession()
    if(!session) redirect("/")
  return (
    <div>
      <ContentGeneratorClient/>
    </div>
  )
}

export default CaptionGeneratorPage
