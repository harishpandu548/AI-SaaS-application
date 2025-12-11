"use client"
import React from 'react'
import { useState } from 'react'
import axios from 'axios'

function EmailWriterClient() {
    const [subject,setSubject]=useState("")
    const [tone, setTone] = useState("professional")
    const [details, setDetails] = useState("")
    const [loading, setLoading] = useState(false)
    const [email,setEmail]=useState("")

    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setEmail("")
        try {
            const res=await axios.post("/api/ai/email",{subject,tone,details})
            setEmail(res.data.email)     
        } catch (error) {
            console.error("Error at fetching Email data",error)     
            alert("Failed to fetch email api")
        }
        finally{
            setLoading(false)
        }
        
    }
    
  return (
    <div>
        <h1>AI email writer</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter Subject of your email" value={subject} onChange={(e)=>setSubject(e.target.value)} />
            <textarea placeholder='Enter what the email should look like' value={details} onChange={(e)=>setDetails(e.target.value)}></textarea>

            <select value={tone} onChange={(e)=>setTone(e.target.value)}>
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Casual">Casual</option>
            </select>
            <button disabled={loading}>
                {loading?"Generating...":"Generate Email"}
            </button>

        </form>

        {email&&(
            <div>
                {email}
            </div>
        )}
      
    </div>
  )
}

export default EmailWriterClient
