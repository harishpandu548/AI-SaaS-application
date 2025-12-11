"use client"
import axios from 'axios'
import React,{useState} from 'react'

declare global{
    interface Window{
        Razorpay?:any;
    }
}

function RazorpayUpgradeButton() {
    const [loading,setloading]=useState(false)

    async function handleUpgrade() {
        setloading(true)

        const res=await axios.post("/api/billing/checkout")
        const data=res.data

        //checks if the subscription was created from backend
        if(!data.subscriptionId){
            alert("Error starting subscription")
            setloading(false)
            return
        }

        //razorpay pop up shows all this options to the user
        const options={
            key:data.key,
            subscription_id:data.subscriptionId,
            name:"AI SAAS Platform",
            description:"PRO Users",

            //runs only when payment is successful
            handler:function(response:any){
                console.log("Payment success",response)
                alert("Payment successful!")
            },
            theme:{color:"#3399cc"}
        }

        //opens razorpay payment window so users can pay
        // bcz of the script we mentioned in layout we need to write window.rzp
        const rzp=new window.Razorpay(options)
        rzp.open()
        setloading(false)
    }

  return (
    <div>
        <button className="px-4 py-2 rounded-lg bg-white text-indigo-700 font-medium" disabled={loading} onClick={handleUpgrade}>
                {loading?"Opening Razorpay":"Upgrade to Pro"}
        </button>
      
    </div>
  )
}

export default RazorpayUpgradeButton