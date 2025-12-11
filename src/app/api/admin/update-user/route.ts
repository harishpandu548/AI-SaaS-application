import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { error } from "console";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest) {
    const session=await getServerAuthSession()
    if(!session){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    if(session.user?.role!=="ADMIN") return NextResponse.json({error:"Forbidden. You are not allowed here"},{status:403})

    const body=await req.json()
    const {userId,role,plan,credits}=body;

    if(!userId) return NextResponse.json({error:"User Id is Required"},{status:403})
    
        const dataToUpdate:any={}

        if(role==="USER"||role==="ADMIN"){
            dataToUpdate.role=role }

        if(plan==="FREE"||plan==="PRO"){
            dataToUpdate.plan=plan
        }
        if(typeof credits==="number"){
            dataToUpdate.credits=credits
        }

        //if admin removes user or free etc and didnot typed new value we are giving him the error
         if (Object.keys(dataToUpdate).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }
//updating that user with this new data in database
try {
    const updateUser=await prisma.user.update({
        where:{id:userId},
        data:dataToUpdate
    })
    return NextResponse.json({ user: updateUser });

    
} catch (error) {
    console.error("failed to update user")
    return NextResponse.json({
        error:"Failed to update user"
    },{status:500})
    
}

    
}