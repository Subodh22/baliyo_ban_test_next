import React from 'react'
import Head from "next/head";
import { trpc } from "../utils/trpc";
 
 
import Link from "next/link";

export default function NavBar() {
  return (<div className="  "> 
    <Head>
    <title>BaliyoBan</title>
  
    <link rel="icon" href="/icon.ico" />
  </Head>
  <div className="p-2.5  m-5  bg-yellow-300 justify-center items-center gap-2.5 inline-flex">
        <div className="text-black text-[35px] font-light  ">BaliyoBan</div>
        
    </div>
    <div className="w-full h-[0px] origin-top-left  border "></div>
 </div>
  )
}
