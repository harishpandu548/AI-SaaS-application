"use client"

import axios from 'axios'
import React, { useState } from 'react'

function ContentGeneratorClient() {
    const [topic, setTopic] = useState("")
    const [details, setDetails] = useState("")
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState("")

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setTopic("")
        try {
            const res=await axios.post("/api/ai/content",{topic,details})
            setContent(res.data.caption)
            
        } catch (error) {
            console.error(error)
            alert("Failed to call Content AI")
        }
        finally{
            setLoading(false)
        }
        
    }
  return (
    <div>
      Caption Generator
      <div>
        <form onSubmit={handleSubmit}>
            <input type="text" value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder='Enter text to generate captions' />
            <input type="text" value={details} onChange={(e)=>setDetails(e.target.value)} placeholder='Captions for Insta Fb ..' />
            <button disabled={loading}>
                {loading?"Generating...":"Generate Captions"}
            </button>
        </form>
      </div>
      {content&&(
        <div>{content}</div>
      )}
    </div>
  )
}

export default ContentGeneratorClient
