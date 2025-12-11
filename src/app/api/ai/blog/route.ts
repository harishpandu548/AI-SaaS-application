import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateBlogPost } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const session=await getServerAuthSession()
    if(!session){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    //get user from session 
    const userId=session?.user?.id;
     
    const user=await prisma.user.findUnique({
        where:{id:userId}
    })

    if(!user){
        return NextResponse.json({error:"User not found"},{status:401})
    }

    //checking user credits
    if(user.plan==="FREE" && user.credits<=0){
        return NextResponse.json({
            error:"Your free credits are finished. Upgrade to pro plan to continue"
        },{status:403})
    }

    const body=await req.json()
    const topic=body.topic as string| undefined;
    const tone=(body.tone as string| undefined) ?? "friendly";

    if(!topic || topic.trim().length===0){
        return NextResponse.json({
            error:"Topic is required"
        },{status:400})
    }
    try {
        const blog=await generateBlogPost(topic,tone)
        //deduct one free for free user
        if(user.plan==="FREE"){
            await prisma.user.update({
                where:{id:userId},
                data:{credits:user.credits-1}
            })
        }
        return NextResponse.json({blog},{status:200})
        
    } catch (error) {
        console.error("Error Generating Blog:",error)
        return NextResponse.json({
            error:"Failed to Generate Blog"
        },{status:500})
        
    }

    
}