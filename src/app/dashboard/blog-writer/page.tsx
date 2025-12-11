import { getServerAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import BlogWriterClient from './client'

async function page() {
    const session=await getServerAuthSession()
    if(!session){
        redirect("/")
    }
  return (
    <div>
      <BlogWriterClient/>
    </div>
  )
}

export default page
