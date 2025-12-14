import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest) {
    const session=await getServerAuthSession()
    if(!session) return NextResponse.json({error:"Unauthorized"},{status:401})

    const userId=session.user?.id
    const{searchParams}=new URL(req.url)
    const chatId=searchParams.get("chatId")

    if(!chatId) return NextResponse.json({error:"chatId is required"},{status:400})

        //making sure this chat belongs to the user
        const chat=await prisma.chat.findFirst({
            where:{
                id:chatId,
                userId:userId,
            }
        })
        if(!chat) return NextResponse.json({error:"chat not found"},{status:400})
        
        //get all the msgs from that chat
        const messages=await prisma.chatMessage.findMany({
            where:{chatId:chatId},
            orderBy:{createdAt:"asc"}
        })

        //give this details to frontend and shape them 
        return NextResponse.json({
            chat:{
                id:chat.id,
                title:chat.title
            },
            messages:messages.map((m)=>({
                id:m.id,
                role:m.role, //can be user and assistant
                content:m.content,
                createdAt:m.createdAt
            }))

        })
    
}