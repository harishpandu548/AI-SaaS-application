import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

export async function GET(){
    try {
        // manually creating user in db
        // const user=await prisma.user.create({
        //     data:{
        //         name:"Exuser",
        //         email:"harishpandu@gmail.com"
        //     }
        // })
        // return NextResponse.json(user);

        //get all users from our db
        const users=await prisma.user.findMany();
        return NextResponse.json({
            success:true,
            count:users.length,
            users,
        },{status:200})

        
    } catch (error) {
        console.error("Error fetching Users",error);
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        },{status:500})
        
    }
}