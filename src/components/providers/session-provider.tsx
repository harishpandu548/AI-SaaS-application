"use client"

import { SessionProvider } from "next-auth/react" 
import React, { ReactNode } from "react";
import type { Session } from "next-auth";


interface Props{
    children:ReactNode;
    session?:Session | null;
}

export function CustomSessionProvider({children}:Props){
    return(
        <SessionProvider >
            {children}
        </SessionProvider>
    )
}