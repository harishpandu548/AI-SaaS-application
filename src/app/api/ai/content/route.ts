import { getServerAuthSession } from "@/lib/auth";
import { generateCaptions } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const session=await getServerAuthSession()
    if(!session) return NextResponse.json({error:"Unauthorized"},{status:401})

        const {topic,details}=await req.json()
        if(!topic||!details){
            return NextResponse.json({error:"Fields are empty but required"},{status:400})
        }
        try {
            const caption=await generateCaptions(topic,details)
            return NextResponse.json({caption})
            
        } catch (error) {
            console.error("Caption Generation Error",error)
            return NextResponse.json({error:"Failed to Generate Captions"},{status:500})
            
        }
}