import React, { useState } from 'react'
import { trpc } from '../utils/trpc'

export default function NewsLetter() {
    const [email,setEmail]=useState("")
    const [canSubmit,setCanSubmit] = useState(true)
    const addtest = trpc.post.addBetaTester.useMutation();
    const sendEmail=()=>
    {
        console.log("wokring")
        // addtest.mutate({
        //     email:email
        // },{onSuccess:()=>{
        //     setCanSubmit(false)
        //     alert("already added")
        // }})
    }
  return (
    <div className="  p-6    w-1/2 mt-10">
    <h2 className="text-black text-xl font-light tracking-tight">Become a select few to test the beta</h2>
    <div className="flex mt-2">
        <input 
            type="email" 
            value={email}
            onChange={(e)=>{setEmail(e.target.value) }}
            placeholder="Your email address" 
            className="flex-grow p-2   border-t border-b border-l border-gray-300 outline-none"
        />
        <button onClick={()=>{console.log("button Clicked")
                
    }} className="bg-yellow-300 w-40 text-black  p-2 px-4   hover:bg-yellow-500 transition duration-300">
           Join
        </button>
    </div>
</div>
  )
}
