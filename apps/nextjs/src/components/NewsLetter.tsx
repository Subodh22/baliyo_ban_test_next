import React, { useState } from 'react'
import { trpc } from '../utils/trpc'

export default function NewsLetter() {
    const [email,setEmail]=useState("")
    const [canSubmit,setCanSubmit] = useState(true)
    const addtest = trpc.post.addBetaTester.useMutation();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    function isValidEmail(email:string) {
        return emailRegex.test(email);
      }
    function handleEmailChange() {
     
        setEmail(email);
      
        if (!isValidEmail(email)) {
         alert("Your email is not valid")
        } else{
            if(email!=="")
            {  addtest.mutate({
                  email:email
              },{onSuccess:()=>{
                  setCanSubmit(false)
                  alert("already added")
              }})}else{
                  alert("Type your email address")
              }
        }
        
      }
  
  return (
    <div className="  p-6    w-3/4 mt-10">
    <h2 className="text-black text-xl font-light tracking-tight">Become a select few to test the beta</h2>
    <div className="flex mt-2">
        <input 
            type="email" 
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            placeholder="Your email address" 
            className="flex-grow p-2   border-t border-b border-l border-gray-300 outline-none"
        />
        <button onClick={handleEmailChange} className="bg-yellow-300 w-40 text-black  p-2 px-4   hover:bg-yellow-500 transition duration-300">
           Join
        </button>
    </div>
</div>
  )
}
