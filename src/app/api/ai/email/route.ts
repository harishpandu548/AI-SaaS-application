import { getServerAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {model} from "@/lib/gemini"



export async function POST(req:NextRequest){
    const session=await getServerAuthSession()
    if(!session) return NextResponse.json({error:"Unauthorized User"},{status:401})
    
        const {subject,details,tone}=await req.json()
        if(!subject || !details){
            return NextResponse.json({error:"Missing Fields"},{status:400})
        }

        const prompt=`write a ${tone} email.
        Subject: ${subject}.
        Details to include: ${details}
        Make it clean,professional, and easy to read`;

        try {
            const result=await model.generateContent(prompt)
            const email=result.response.text()
            return NextResponse.json({email})
  
        } catch (error) {
            console.error("Error writing Email",error)
            return NextResponse.json({error:"AI error"},{status:500})
        }
}