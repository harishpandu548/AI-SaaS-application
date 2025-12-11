import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PdfSummarizerClient from "./client";


export default async function PdfSummarizerPage() {
    const session=await getServerAuthSession()
    if (!session) redirect("/");

    return <PdfSummarizerClient/>

}